// Create a context menu item
chrome.contextMenus.create({
  id: "beshify-text",
  title: "Beshify",
  contexts: ["editable"]
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "beshify-text") {
    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { type: "BESHIFY_TEXT" });
  }
});