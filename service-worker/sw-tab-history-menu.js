// NOTE: Create a context Menu called History of Opened Tabs when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tabs-hist",
    title: "History of Opened Tabs",
    contexts: ["action"],
  });

  chrome.contextMenus.create({
    id: "export-tabs",
    title: "Export Open Tabs",
    contexts: ["action"],
  });
});

// NOTE:  On click, open the Tabs_history page
// (info: OnClickData, tab: Tab) => {...}
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Open the HTML page in a new tab
  if (info.menuItemId === "tabs-hist") {
    chrome.tabs.create({ url: "../context_options/Tabs_history.html" });
  }
  // EXPORT TABS functionality
  else if (info.menuItemId === "export-tabs") {
    // Get the current tabs and store it in chrome.storage
    // Redirect to new tab which downloads the file created with links
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        // console.log("No tabs are open.");
        alert("No tabs are open");
      }
      // Create a blob that contains the tabs details
      const openedTabs = tabs.map((tab) => {
        // NOTE: Does not work for New Tabs or extensions page
        if (!tab.title) {
          tab.title = "New Tab";
          tab.url = "https://google.com/";
        }
        return {
          title: tab.title,
          url: tab.url,
        };
      });
      // console.log(openedTabs);
      chrome.storage.local.set({ openedTabs: openedTabs }, () => {
        chrome.tabs.create({ url: "../context_options/download.html" });
      });
    });
  }
});

// Reference: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/api-samples/contextMenus/basic/sample.js
