// file-upload.handler.ts

interface FileContent {
    name: string;
    content: string;
  }
  
  export class FileUploadHandler {
    /**
     * Verarbeitet die ausgewählten Dateien aus einem Ordner
     * @param event Das Event vom File-Input
     * @returns Promise mit einem Array von FileContent-Objekten und möglichen Fehlermeldungen
     */
    static async handleFolderUpload(event: Event): Promise<{
      files: string[];
      errorMessage?: string;
      successMessage?: string;
    }> {

      // Erstelle einen temporären input type="file"
      const input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('webkitdirectory', '');
      input.setAttribute('directory', '');
      input.style.display = 'none';
      document.body.appendChild(input);

      // Erstelle ein Promise für die Dateiauswahl
      const files = await new Promise<FileList | null>((resolve) => {
        input.onchange = (event) => {
          const files = (event.target as HTMLInputElement).files;
          resolve(files);
        };
        // Trigger Dateiauswahl-Dialog
        input.click();
      });

      // Entferne das temporäre Input-Element
      document.body.removeChild(input);
      
      if (!files || files.length === 0) {
        return {
          files: [],
          errorMessage: 'Keine Dateien ausgewählt'
        };
      }
  
      const fileContents: string[] = [];
      let hasInvalidFiles = false;

      const firstFile = files[0] as any; // 'any' wird benötigt, um auf webkitRelativePath zuzugreifen
      const folderPath = firstFile.webkitRelativePath || '';
      const folderName = folderPath.split('/')[0];
      fileContents.push(folderName);
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Überprüfe, ob es sich um eine .txt-Datei handelt
        if (!file.name.toLowerCase().endsWith('.txt')) {
          hasInvalidFiles = true;
          continue;
        }
  
        try {
          const content = await FileUploadHandler.readFileContent(file);
          fileContents.push(content);
        } catch (error) {
          console.error(`Fehler beim Lesen der Datei ${file.name}:`, error);
          return {
            files: fileContents,
            errorMessage: `Fehler beim Lesen der Datei ${file.name}`
          };
        }
      }
  
      let errorMessage: string | undefined;
      let successMessage: string | undefined;
  
      if (hasInvalidFiles) {
        errorMessage = 'Einige Dateien wurden übersprungen, da sie keine .txt-Dateien sind';
      }
  
      if (fileContents.length > 0) {
        successMessage = `${fileContents.length} Datei(en) erfolgreich geladen`;
      }
  
      return {
        files: fileContents,
        errorMessage,
        successMessage
      };
    }
  
    /**
     * Liest den Inhalt einer Datei
     * @param file Die zu lesende Datei
     * @returns Promise mit dem Dateiinhalt als String
     */
    private static readFileContent(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        
        reader.onerror = (e) => {
          reject(new Error('Fehler beim Lesen der Datei'));
        };
        
        reader.readAsText(file);
      });
    }
  }