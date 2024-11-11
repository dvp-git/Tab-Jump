// NOTE: Create a context Menu called History of Opened Tabs when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tabs-hist",
    title: "History of Opened Tabs",
    contexts: ["action"],
  });
});

// NOTE:  On click, open the Tabs_history page
// (info: OnClickData, tab: Tab) => {...}
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tabs-hist") {
    // Open the HTML page in a new tab
    chrome.tabs.create({ url: "../context_options/Tabs_history.html" });
  }
});
