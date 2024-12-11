// This script should present a search box  to search the tabs and populate according to searchTerm
// NOTE: Function to fetch open Tabs
const fetchAndLogTabs = async () => {
  let searchInput = document.getElementById("search-box");
  const listContainer = document.getElementById("tab-list");
  const tabs = await chrome.tabs.query({ currentWindow: true }); // NOTE: current window true [ works only for current browser window ]

  // When the user types in the search box, filter the list of tabs
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    listContainer.innerHTML = "";
    tabs.forEach((tab) => {
      if (
        tab.title.toLowerCase().includes(searchTerm) ||
        tab.url.toLowerCase().includes(searchTerm)
      ) {
        const tabElement = document.createElement("li");
        tabElement.classList.add("list-item");
        tabElement.id = tab.id;
        tabElement.textContent = `${tab.title} `;
        tabElement.setAttribute("role", "menuitem");
        tabElement.setAttribute("tabindex", "0");
        listContainer.appendChild(tabElement);
      }
    });
  });

  // NOTE: Switch to tab using tabid - chrome.tabs.update(tabId: Number, { active: true });
  listContainer.addEventListener("click", (e) => {
    // console.log(`Event attached on ${e.currentTarget.id}`);
    // console.log(
    //   `Clicked element ${e.target.className} ${e.target.id} ${e.target.textContent}`
    // );
    if (e.target && e.target.className == "list-item")
      chrome.tabs.update(Number(e.target.id), { active: true });
  });

  // NOTE: Switch to tab using arrow keys - chrome.tabs.update(tabId: Number, { active: true });
  listContainer.addEventListener("keydown", (e) => {
    // console.log(`Event attached on ${e.currentTarget.id}`);
    // console.log(
    //   `Clicked element ${e.target.className} ${e.target.id} ${e.target.textContent}`
    // );
    if (e.target && e.target.className == "list-item") {
      switch (e.key) {
        case "Enter":
          chrome.tabs.update(Number(e.target.id), { active: true });
          break;
        case "ArrowDown":
          e.preventDefault();
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          } else {
            e.target.parentElement.firstElementChild.focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          } else {
            e.target.parentElement.lastElementChild.focus();
          }
          break;
      }
    }
  });
};

fetchAndLogTabs();
