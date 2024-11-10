// This script should present a search box  to search the tabs
console.log("This is a popup test");

const fetchAndLogTabs = async () => {
  let searchInput = document.getElementById("search-box");
  const listContainer = document.getElementById("tab-list");
  const tabs = await chrome.tabs.query({ currentWindow: true }); // NOTE: current window true

  // When the user types in the search box, filter the list of tabs
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    //
    // console.log(chrome.tabs);
    // console.log(e.target.value);
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
        listContainer.appendChild(tabElement);
      }
    });
  });

  //   const tabElementClicked = chrome.tabs.update(tab.id, { active: true });
  listContainer.addEventListener("click", (e) => {
    console.log(`Event attached on ${e.currentTarget.id}`);
    console.log(
      `Clicked element ${e.target.className} ${e.target.id} ${e.target.textContent}`
    );
    chrome.tabs.update(Number(e.target.id), { active: true });
  });
};

fetchAndLogTabs();

// On text string , provide a list of string values from the open tabs

// On clicking a tab, change the focus to that tab
