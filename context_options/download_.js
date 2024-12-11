// Export the open tabs to your local device
// Fetch the tab URL's  is download.html
// Crate a text file with the contents of openedTabs, stringify the contents
// After download close the file.

// To prevent cross site scripting : embed as html.textContent
function sanitizeInput(input) {
  const temp = document.createElement("div");
  temp.textContent = input;
  return temp.innerHTML;
}

// Cryptographic Hash for securing the inline scripts

// Reference;
//https://www.vector-logic.com/blog/posts/generating-csp-hash-from-browser-console
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
async function hashScript(content) {
  const enc = new TextEncoder();
  const data = enc.encode(content);
  const bufferDigest = await crypto.subtle.digest("SHA-256", data);
  return ["sha256", _arrayBufferToBase64(bufferDigest)].join("-");
}

function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

document.addEventListener("DOMContentLoaded", async () => {
  //  BUG: ERROR: QUOTA_BYTES_PER_ITEM quota exceeded when using chrome.storage.sync. Storing large number of tabs causes memory bounds issue while using chrome.storage.sync
  // DEBUG: Test limits while using
  //  WORKAROUND: fetch the openedTabs from chrome storage local instead
  const { openedTabs } = await chrome.storage.local.get("openedTabs");
  console.log("Opened tabs data");
  console.log(openedTabs);
  try {
    const doc = document.implementation.createHTMLDocument("Saved Tabs");

    const head = doc.head;
    const metaCharset = doc.createElement("meta");
    metaCharset.setAttribute("charset", "UTF-8");
    head.appendChild(metaCharset);

    const metaViewPort = doc.createElement("meta");
    metaViewPort.setAttribute("name", "viewport");
    metaViewPort.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0"
    );
    head.appendChild(metaViewPort);

    const styleContent = `
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
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007acc;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #005f99;
    }
  `;

    const scriptContent = `document.addEventListener("DOMContentLoaded", () => {
    const openAllButton = document.getElementById("openAllLinks");
    console.log(openAllButton);
    openAllButton.addEventListener("click", () => {
    if (confirm("To open all tabs Navigate to the Popup blocked This may open multiple tabs sim")) {
      console.log("Clicked");

      const links = Array.from(document.getElementsByClassName("list-item"));
      console.log(links);
      links.forEach((link, index) => {
        setTimeout(() => {
          window.open(link.children[0].href);
        }, index * 500);
      });
      } else {
        console.log("Cancelled");
      }
    });
  });
  `;

    // Referance: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
    const styleHash256 = await hashScript(styleContent);
    const scriptHash256 = await hashScript(scriptContent);
    const metaSecurity = doc.createElement("meta");
    metaSecurity.setAttribute("http-equiv", "Content-Security-Policy");
    metaSecurity.setAttribute(
      "content",
      `default-src 'self'; style-src 'strict-dynamic' '${styleHash256}'; script-src 'strict-dynamic' '${scriptHash256}' ;`
    );
    head.appendChild(metaSecurity);

    const title = doc.createElement("title");
    title.textContent = "Saved Tabs";
    head.appendChild(title);

    const style = doc.createElement("style");
    style.textContent = styleContent;
    head.appendChild(style);

    const body = doc.body;
    const h1 = doc.createElement("h1");
    h1.textContent = "Your Saved Tabs";
    body.appendChild(h1);

    const button = doc.createElement("button");
    button.id = "openAllLinks";
    button.textContent = "Open All Links";
    body.appendChild(button);

    const ul = doc.createElement("ul");
    ul.id = "tabs-list";
    body.appendChild(ul);
    openedTabs
      .filter(
        (tab) =>
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("edge://") &&
          !tab.url.startsWith("extension://")
      )
      .map((tab) => {
        {
          const { title, url } = tab;
          const listItem = document.createElement("li");
          listItem.classList.add("list-item");
          const link_ = document.createElement("a");
          link_.setAttribute("href", url);
          link_.setAttribute("target", "_blank");
          link_.textContent = title;
          listItem.appendChild(link_);
          ul.appendChild(listItem);
        }
      });

    const script = doc.createElement("script");
    script.textContent = scriptContent;
    body.appendChild(script);

    // Serialize the document to a string
    // const serializer = new XMLSerializer();
    // const htmlContent = serializer.serializeToString(doc);
    console.log("Just before outerhtml");
    console.log(head);

    console.log(body);
    console.log(doc.documentElement.outerHTML);

    // .join("")}

    // HACK: Store the file as a Blob and html file
    if (doc.documentElement.outerHTML.includes(`class="list-item">`)) {
      const blob = new Blob([doc.documentElement.outerHTML], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download(
        {
          url: url,
          filename: "all_tabs.html",
          saveAs: true,
        },
        function (downloadId) {
          // console.log("I am downloading " + downloadId);
          URL.revokeObjectURL(url);
          // Close window after download
          window.close();
        }
      );
    } else {
      console.log("No tabs to export");
      alert("No tabs are open");
      window.close();
    }
  } catch (error) {
    console.log("Error exporting tabs: ", error);
  }
});
