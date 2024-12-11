// https://developer.chrome.com/docs/extensions/reference/api/action
// https://developer.chrome.com/docs/extensions/reference/api/commands

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    chrome.action.openPopup();
  }
});
