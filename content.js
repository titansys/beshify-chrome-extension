// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BESHIFY_TEXT") {
    let originalActiveElement;
    let text, range, selectedNode, selectedTextNode;

    // If there's an active text input or a contentEditable element
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT" ||
        (document.activeElement.nodeName.toUpperCase() === "SPAN" && document.activeElement.getAttribute('data-lexical-text') === 'true'))
    ) {
      // Set as original for later
      originalActiveElement = document.activeElement;

      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        text = range.toString().trim();
        selectedNode = range.startContainer.parentNode;
        if (range.startContainer.nodeType === 3) {
          selectedTextNode = range.startContainer;
        }
      }

      // If no text is selected within the active input or textarea, use the whole text
      if (!text) {
        text = originalActiveElement.textContent;
      }
    } else {
      // If no active text input, use any selected text on page
      text = document.getSelection().toString().trim();
    }

    if (!text) {
      alert(
        "No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text."
      );
      return;
    }

    // Create an array of words
    let words = text.split(' ');

    // Add emoji between words
    let beshifiedText = words.join(' 🤸 ');

    if (originalActiveElement) {
      if (originalActiveElement.nodeName.toUpperCase() === "TEXTAREA" || originalActiveElement.nodeName.toUpperCase() === "INPUT") {
        // If some text was selected, replace only the selected text
        if (range) {
          let start = originalActiveElement.selectionStart;
          let end = originalActiveElement.selectionEnd;
          originalActiveElement.setRangeText(beshifiedText, start, end);
        } else {
          // If no text was selected, replace the whole text
          originalActiveElement.value = beshifiedText;
        }
      } else if (originalActiveElement.isContentEditable || (originalActiveElement.nodeName.toUpperCase() === "SPAN" && document.activeElement.getAttribute('data-lexical-text') === 'true')) {
        // Replace selected text in a contentEditable field
        let docFrag = document.createDocumentFragment();
        docFrag.appendChild(document.createTextNode(beshifiedText));
        
        if (range && selectedNode.contains(document.activeElement)) {
          range.deleteContents();
          range.insertNode(docFrag);
        } else if (selectedTextNode) {
          // if selected text is a text node, replace the content of the text node
          selectedTextNode.nodeValue = beshifiedText;
        } else {
          originalActiveElement.textContent = beshifiedText;
        }
      }
    }
  }
});
