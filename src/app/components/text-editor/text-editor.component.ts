import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ButtonEditorComponent } from "../../shared/button-editor/button-editor.component";
import { Book } from '../../models';
import { BookService } from '../../book.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [ButtonEditorComponent],
  template: `
  <div class="w-1/2 h-96 ml-72 mt-14" >
    <div id="toolbar"> 
      <app-button-editor name="bold" (boutonClicked)="handleBoldEvent()"/>
      <app-button-editor name="italic" (boutonClicked)="handleItalicEvent()"/>
      <app-button-editor name="underline" (boutonClicked)="handleUnderlineEventNew()"/>
      <app-button-editor name="remove style" (boutonClicked)="handleRemoveStyle()"/>
      <app-button-editor name="size +" (boutonClicked)="adjustSelectionFontSize('increase')"/>
      <app-button-editor name="size -" (boutonClicked)="adjustSelectionFontSize('decrease')"/>
    </div> 
    <div id="editor" contenteditable="true" class="w-full h-96 p-4 border-4" (change)="checkOverflow()"></div>
    @if (this.bookService.bookSelected()!.pages.length !== this.bookService.pageSelected()?.number) {
        <app-button-editor name="new page" (boutonClicked)="handleNewPage()" />
    }
  </div>
  `,
  styles: ``
})
export class TextEditorComponent {
    bookDefault = new Book("default", "root")

    ngOnInit() {
        const editor = document.getElementById("editor");
        if (editor === null) { return }
        const numberOfPage = this.bookService.bookSelected()!._pages.length;
        if (numberOfPage > 0) {
            editor.innerHTML = this.bookService.bookSelected()!._pages[numberOfPage - 1]._content
        } else {
            const newPage = new Page(0, '', this.bookService.bookSelected()!.title);
            this.bookService.bookSelected()?.pages.push(newPage)
            this.bookService.selectPage(newPage);
        }
    }


    checkOverflow() {
        const editor = document.getElementById("editor");
        if (editor === null) { return }

        if (editor.scrollHeight > editor.clientHeight) {
            this.handleNewPage();
        }
    }

    handleNewPage() {
        this.bookService.retrieveEditorContent()

        const numberNextPage = this.bookService.bookSelected()!._pages.length;

        const newPage: Page = new Page(numberNextPage, '', this.bookService.bookSelected()!._parent!)
        this.bookService.bookSelected()!._pages.push(newPage);

        const page = this.bookService.bookSelected()?.pages[numberNextPage];
        if (page) {
        this.bookService.selectPage(page);
        }

    }

    constructor (public bookService: BookService) {}

    adjustSelectionFontSize(action: string) {
        // const editor = document.getElementById('editor');
        // if (editor) {
        //     editor.style.fontSize = "16px";
        // }

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) return;
    
        if (!selection.rangeCount) {
            console.error("No selection detected!");
            return;
        }
    
        const range = selection.getRangeAt(0);
    
        // Ensure the range is not collapsed
        if (range.collapsed) {
            console.error("Selection is collapsed, nothing to adjust.");
            return;
        }
    
        // Wrap the selection with a span
        const span = document.createElement("span");   
        const currentFontSize = window.getComputedStyle(range.startContainer.parentElement!).fontSize;
        const fontSizeValue = parseFloat(currentFontSize);
    
        // Determine the new font size based on the action
        let newFontSize;
        if (action === "increase") {
            newFontSize = fontSizeValue + 2; // Increase by 2 units
        } else if (action === "decrease") {
            newFontSize = Math.max(1, fontSizeValue - 2); // Decrease by 2 units, min 1
        } else {
            console.error("Invalid action. Use 'increase' or 'decrease'.");
            return;
        }
    
        // Apply the new font size to the span
        span.style.fontSize = `${newFontSize}px`;
    
        // Replace the selected content with the span
        range.surroundContents(span);
    
        // Re-select the span's contents
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    

    handleRemoveStyle() {
        const container = document.getElementById('editor');

        const range = document.createRange();
        range.setStart(container?.firstChild!, 0);
        range.setEnd(container?.lastChild!, 0)


        // Regular process
        const originalContent = range.cloneContents();
        range.deleteContents();

        const processNode = (node: Node): Node => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.cloneNode()
            }

            if (node instanceof HTMLElement) {
                if (node.tagName === 'SPAN') {
                    // Remove bold spans
                    const fragment = document.createDocumentFragment();
                    node.childNodes.forEach(child => {
                        fragment.appendChild(processNode(child));
                    });
                    return fragment;
                } else {
                return node.cloneNode(true);
                }
            }
            return node.cloneNode(true);
        };

        const newFragment = document.createDocumentFragment();
        originalContent.childNodes.forEach(node => {
            newFragment.appendChild(processNode(node));
        });

        range.insertNode(newFragment);

        // Normalize the parent container to clean up text nodes
        const editor = document.getElementById('editor'); // Assuming 'editor' is the container
        if (editor) {
            editor.normalize();
        }
        // selection.removeAllRanges();
    }

  handleBoldEvent() {
    const container = document.getElementById('editor');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    // Helper function to check if a node or its ancestors have bold
    const hasboldStyle = (node: Node): boolean => {
      let currentNode: Node | null = node;
      while (currentNode) {
          if (currentNode instanceof HTMLElement) {
              if (currentNode.style.fontWeight.includes('bold')) {
                  return true;
              }
              if (currentNode === container) { 
                break; 
            }
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have bold
  const hasbold = hasboldStyle(range.startContainer) || hasboldStyle(range.endContainer);

  if (hasbold && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      let parentToRemove = textNode.parentNode as HTMLElement;
      const parentOfParent = parentToRemove.parentElement;
              
      if ((range.startOffset > 0 || range.endOffset < textNode.textContent!.length) && parentOfParent !== null) {
          // Create three spans: before selection, selection, and after selection
          if (range.startOffset > 0) {
              const beforeSpan = document.createElement('span');
              beforeSpan.style.fontWeight = 'bold';
              beforeSpan.textContent = textNode.textContent!.substring(0, range.startOffset);
              parentOfParent.insertBefore(beforeSpan, parentToRemove);
          }

          const selectionSpan = document.createElement('span');
          selectionSpan.style.fontWeight = 'none';
          selectionSpan.textContent = textNode.textContent!.substring(range.startOffset, range.endOffset);
          parentOfParent.insertBefore(selectionSpan, parentToRemove);

          if (range.endOffset < textNode.textContent!.length) {
              const afterSpan = document.createElement('span');
              afterSpan.style.fontWeight = 'bold';
              afterSpan.textContent = textNode.textContent!.substring(range.endOffset);
              parentOfParent.insertBefore(afterSpan, parentToRemove);
          }
          
          parentOfParent.removeChild(parentToRemove);
          parentOfParent.normalize();

          selection.removeAllRanges();
          return;
      }
      while (parentToRemove) {
        if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.fontWeight === 'bold') {
            let parent = parentToRemove.parentNode;
            if (parent) {
                while (parentToRemove.firstChild) {
                    parent.insertBefore(parentToRemove.firstChild, parentToRemove);
                }
                parent.removeChild(parentToRemove);
                parent.normalize();
            }
            return;
        }
        if (parentToRemove === container) { 
            break; 
        }
        if (parentToRemove.parentElement !== null) {
            parentToRemove = parentToRemove.parentElement;
        }   
    }
}

    // Regular processing for other cases
    const originalContent = range.cloneContents();
    range.deleteContents();

    const processNode = (node: Node): Node => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.cloneNode()
        }

        if (node instanceof HTMLElement) {
            if (node.tagName === 'SPAN' && (node.style.fontWeight === 'bold' || node.style.fontWeight === 'none')) {
                // Remove bold spans
                const fragment = document.createDocumentFragment();
                node.childNodes.forEach(child => {
                    fragment.appendChild(processNode(child));
                });
                return fragment;
            } else {
              return node.cloneNode(true);
            }
        }
        return node.cloneNode(true);
    };

    const newFragment = document.createDocumentFragment();
    originalContent.childNodes.forEach(node => {
        newFragment.appendChild(processNode(node));
    });

    const span = document.createElement('span');
    span.style.fontWeight = 'bold';

    range.insertNode(newFragment);
    range.surroundContents(span);
    // Normalize the parent container to clean up text nodes
    const editor = document.getElementById('editor'); // Assuming 'editor' is the container
    if (editor) {
        editor.normalize();
    }
    selection.removeAllRanges();
  }

  handleItalicEvent() {
    const container = document.getElementById('editor');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    // Helper function to check if a node or its ancestors have italic
    const hasitalicStyle = (node: Node): boolean => {
      let currentNode: Node | null = node;
      while (currentNode) {
          if (currentNode instanceof HTMLElement) {
              if (window.getComputedStyle(currentNode).fontStyle.includes('italic')) {
                  return true;
              }
              if (currentNode === container) { 
                break; 
            }
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have italic
  const hasitalicd = hasitalicStyle(range.startContainer) || hasitalicStyle(range.endContainer);

  if (hasitalicd && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      let parentToRemove = textNode.parentNode as HTMLElement;
      let parentOfParent = parentToRemove.parentElement;
              
      if ((range.startOffset > 0 || range.endOffset < textNode.textContent!.length) && parentOfParent !== null) {
          // Create three spans: before selection, selection, and after selection
          if (range.startOffset > 0) {
              const beforeSpan = document.createElement('span');
              beforeSpan.style.fontStyle = 'italic';
              beforeSpan.textContent = textNode.textContent!.substring(0, range.startOffset);
              parentOfParent.insertBefore(beforeSpan, parentToRemove);
          }

          const selectionSpan = document.createElement('span');
          selectionSpan.style.fontStyle = 'none';
          selectionSpan.textContent = textNode.textContent!.substring(range.startOffset, range.endOffset);
          parentOfParent.insertBefore(selectionSpan, parentToRemove);

          if (range.endOffset < textNode.textContent!.length) {
              const afterSpan = document.createElement('span');
              afterSpan.style.fontStyle = 'italic';
              afterSpan.textContent = textNode.textContent!.substring(range.endOffset);
              parentOfParent.insertBefore(afterSpan, parentToRemove);
          }

          parentOfParent.removeChild(parentToRemove);
          parentOfParent.normalize();

          selection.removeAllRanges();
          return;
      }
      
      while (parentToRemove) {
        if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.fontStyle === 'italic') {
            let parent = parentToRemove.parentNode;
            if (parent) {
                while (parentToRemove.firstChild) {
                    parent.insertBefore(parentToRemove.firstChild, parentToRemove);
                }
                parent.removeChild(parentToRemove);
                parent.normalize();
            }
            return;
        }
        if (parentToRemove === container) { 
            break; 
        }
        if (parentToRemove.parentElement !== null) {
            parentToRemove = parentToRemove.parentElement;
        }   
      }
      
    }

    // Regular processing for other cases
    const originalContent = range.cloneContents();
    range.deleteContents();

    const processNode = (node: Node): Node => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.cloneNode()
        }

        if (node instanceof HTMLElement) {
            if (node.tagName === 'SPAN' && (node.style.fontStyle === 'italic' || node.style.fontStyle === 'none')) {
                // Remove italic spans
                const fragment = document.createDocumentFragment();
                node.childNodes.forEach(child => {
                    fragment.appendChild(processNode(child));
                });
                return fragment;
            } else {
              return node.cloneNode(true);
            }
        }
        return node.cloneNode(true);
    };

    const newFragment = document.createDocumentFragment();
    originalContent.childNodes.forEach(node => {
        newFragment.appendChild(processNode(node));
    });

    const span = document.createElement('span');
    span.style.fontStyle = 'italic';

    range.insertNode(newFragment);
    range.surroundContents(span);
    // Normalize the parent container to clean up text nodes
    const editor = document.getElementById('editor'); // Assuming 'editor' is the container
    if (editor) {
        editor.normalize();
    }
    selection.removeAllRanges();
  }


  handleUnderlineEventNew() {
    const container = document.getElementById('editor');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    // Helper function to check if a node or its ancestors have underline
    const hasUnderlineStyle = (node: Node): boolean => {
      let currentNode: Node | null = node;
      while (currentNode) {
          if (currentNode instanceof HTMLElement) {
              if (window.getComputedStyle(currentNode).textDecoration.includes('underline')) {
                  return true;
              }
              if (currentNode === container) { 
                break; 
            }
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have underline
  const hasUnderlined = hasUnderlineStyle(range.startContainer) || hasUnderlineStyle(range.endContainer);

  if (hasUnderlined && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      let parentToRemove = textNode.parentNode as HTMLElement;
      const parentOfParent = parentToRemove.parentElement;
              
      if ((range.startOffset > 0 || range.endOffset < textNode.textContent!.length) && parentOfParent !== null) {
          // Create three spans: before selection, selection, and after selection
          if (range.startOffset > 0) {
              const beforeSpan = document.createElement('span');
              beforeSpan.style.textDecoration = 'underline';
              beforeSpan.textContent = textNode.textContent!.substring(0, range.startOffset);
              parentOfParent.insertBefore(beforeSpan, parentToRemove);
          }

          const selectionSpan = document.createElement('span');
          selectionSpan.style.textDecoration = 'none';
          selectionSpan.textContent = textNode.textContent!.substring(range.startOffset, range.endOffset);
          parentOfParent.insertBefore(selectionSpan, parentToRemove);

          if (range.endOffset < textNode.textContent!.length) {
              const afterSpan = document.createElement('span');
              afterSpan.style.textDecoration = 'underline';
              afterSpan.textContent = textNode.textContent!.substring(range.endOffset);
              parentOfParent.insertBefore(afterSpan, parentToRemove);
          }

          parentOfParent.removeChild(parentToRemove);
          parentOfParent.normalize();

          selection.removeAllRanges();
          return;
      }
      while (parentToRemove) {
        if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.textDecoration === 'underline') {
            let parent = parentToRemove.parentNode;
            if (parent) {
                while (parentToRemove.firstChild) {
                    parent.insertBefore(parentToRemove.firstChild, parentToRemove);
                }
                parent.removeChild(parentToRemove);
                parent.normalize();
            }
            return;
        }
        if (parentToRemove === container) { 
            break; 
        }
        if (parentToRemove.parentElement !== null) {
            parentToRemove = parentToRemove.parentElement;
        }   
    }
    }

    // Regular processing for other cases
    const originalContent = range.cloneContents();
    range.deleteContents();

    const processNode = (node: Node): Node => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.cloneNode()
        }

        if (node instanceof HTMLElement) {
            if (node.tagName === 'SPAN' && (node.style.textDecoration === 'underline' || node.style.textDecoration === 'none')) {
                // Remove underline spans
                const fragment = document.createDocumentFragment();
                node.childNodes.forEach(child => {
                    fragment.appendChild(processNode(child));
                });
                return fragment;
            } else {
              return node.cloneNode(true);
            }
        }
        return node.cloneNode(true);
    };

    const newFragment = document.createDocumentFragment();
    originalContent.childNodes.forEach(node => {
        newFragment.appendChild(processNode(node));
    });

    const span = document.createElement('span');
    span.style.textDecoration = 'underline';

    range.insertNode(newFragment);
    range.surroundContents(span);
    // Normalize the parent container to clean up text nodes
    const editor = document.getElementById('editor'); // Assuming 'editor' is the container
    if (editor) {
        editor.normalize();
    }
    selection.removeAllRanges();

}
}

