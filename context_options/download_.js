// Export the open tabs to your local device
// Fetch the tab URL's  is download.html
// Crate a text file with the contents of openedTabs, stringify the contents
// After download close the file.
document.addEventListener("DOMContentLoaded", async () => {
  //  BUG: ERROR: QUOTA_BYTES_PER_ITEM quota exceeded when using chrome.storage.sync. Storing large number of tabs causes memory bounds issue while using chrome.storage.sync
  // DEBUG: Test limits while using
  //  WORKAROUND: fetch the openedTabs from chrome storage local instead
  const { openedTabs } = await chrome.storage.local.get("openedTabs");
  //   console.log("Opened tabs data");
  //   console.log(openedTabs);
  try {
    // console.log("Data loaded: ");
    // console.log(openedTabs);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Saved Tabs</title>
            <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h1 {
      color: #0ea5e9;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin: 10px 0;
    }
    a {
      text-decoration: none;
      color: #007acc;
    }
    a:hover, a:focus {
      background-color: #0ea5e9;
      color: white;
      font-weight: bold;
      padding: 5px;
      border-radius: 5px;
    }
  </style>
        </head>
        <body>
          <h1>Your Saved Tabs</h1>
          <ul>
            ${openedTabs
              .filter(
                (tab) =>
                  !tab.url.startsWith("chrome://") &&
                  !tab.url.startsWith("edge://") &&
                  !tab.url.startsWith("extension://")
              )
              .map((tab) => {
                {
                  const { title, url } = tab;
                  return `<li className="list-item"><a href="${url}" target="_blank">${title}</a></li>`;
                }
              })
              .join("")}
          </ul>
        </body>
        </html>
      `;
    // HACK: Store the file as a Blob and html file
    if (htmlContent.includes(`className="list-item">`)) {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download(
        {
          url: url,
          filename: "all_tabs.html",
          saveAs: false,
        },
        function (downloadId) {
          // console.log("I am downloading " + downloadId);
          URL.revokeObjectURL(url);
          // Close window after download
          window.close();
        }
      );
    } else {
      alert("No tabs are open");
      window.close();
    }
  } catch (error) {
    console.log("Error exporting tabs: ", error);
  }
});
