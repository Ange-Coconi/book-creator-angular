import { Component } from '@angular/core';
import { ButtonEditorComponent } from "../../shared/button-editor/button-editor.component";

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [ButtonEditorComponent],
  template: `
  <div class="w-96 h-96 ml-72 mt-14" >
    <div id="toolbar"> 
      <app-button-editor name="bold" (boutonClicked)="handleBoldEvent()"/>
      <app-button-editor name="italic" (boutonClicked)="handleItalicEvent()"/>
      <app-button-editor name="underline" (boutonClicked)="handleUnderlineEventNew()"/>
    </div> 
    <div id="editor" contenteditable="true" style="border: 1px solid #ccc; padding: 10px;"> Start typing here... </div>
  </div>
  `,
  styles: ``
})
export class TextEditorComponent {

  handleBoldEvent() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    // Helper function to check if a node or its ancestors have bold
    const hasboldStyle = (node: Node): boolean => {
      let currentNode: Node | null = node;
      while (currentNode) {
          if (currentNode instanceof HTMLElement) {
              if (window.getComputedStyle(currentNode).fontWeight.includes('bold')) {
                  return true;
              }
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have bold
  const hasboldd = hasboldStyle(range.startContainer) || hasboldStyle(range.endContainer);

  if (hasboldd && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      const parentToRemove = textNode.parentNode as HTMLElement;
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

          // parent.removeChild(textNode);
          // parentOfParent?.removeChild(parent);
          selection.removeAllRanges();
          return;
      }
      if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.fontWeight === 'bold') {
          const parent = parentToRemove.parentNode;
          if (parent) {
              while (parentToRemove.firstChild) {
                  parent.insertBefore(parentToRemove.firstChild, parentToRemove);
              }
              parent.removeChild(parentToRemove);
              parent.normalize();
          }
          return;
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
              const span = document.createElement('span');
              span.textContent = node.textContent;
              span.style.textDecoration = node.style.textDecoration;
              span.style.fontStyle = node.style.fontStyle;
              return span;
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
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have italic
  const hasitalicd = hasitalicStyle(range.startContainer) || hasitalicStyle(range.endContainer);

  if (hasitalicd && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      const parentToRemove = textNode.parentNode as HTMLElement;
      const parentOfParent = parentToRemove.parentElement;
              
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

          // parent.removeChild(textNode);
          // parentOfParent?.removeChild(parent);
          selection.removeAllRanges();
          return;
      }
      if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.fontStyle === 'italic') {
          const parent = parentToRemove.parentNode;
          if (parent) {
              while (parentToRemove.firstChild) {
                  parent.insertBefore(parentToRemove.firstChild, parentToRemove);
              }
              parent.removeChild(parentToRemove);
              parent.normalize();
          }
          return;
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
              const span = document.createElement('span');
              span.textContent = node.textContent;
              span.style.textDecoration = node.style.textDecoration;
              span.style.fontWeight = node.style.fontWeight;
              return span;
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
          }
          currentNode = currentNode.parentNode;
      }
      return false;
  };

  // Check if either the start or end containers or their ancestors have underline
  const hasUnderlined = hasUnderlineStyle(range.startContainer) || hasUnderlineStyle(range.endContainer);

  if (hasUnderlined && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer;
      const parentToRemove = textNode.parentNode as HTMLElement;
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

          // parent.removeChild(textNode);
          // parentOfParent?.removeChild(parent);
          selection.removeAllRanges();
          return;
      }
      if (parentToRemove.tagName === 'SPAN' && parentToRemove.style.textDecoration === 'underline') {
          const parent = parentToRemove.parentNode;
          if (parent) {
              while (parentToRemove.firstChild) {
                  parent.insertBefore(parentToRemove.firstChild, parentToRemove);
              }
              parent.removeChild(parentToRemove);
              parent.normalize();
          }
          return;
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
              const span = document.createElement('span');
              span.textContent = node.textContent;
              span.style.fontStyle = node.style.fontStyle;
              span.style.fontStyle = node.style.fontStyle;
              return span;
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

