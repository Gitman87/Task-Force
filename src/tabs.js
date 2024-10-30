class TabPanel {
  constructor(container) {
    this.container = container;
    this.tabList = [];
    this.tabManager = new TabManager(this.tabList);
  }
  initialized() {
    console.log("TabPanel  initialized!");
  }
}
class Tab {
  constructor(title, id) {
    this.title = title;
    this.idTab = id;
  }
}
class TabManager {
  static typeOfElement = "li";
  static classes = ["project-list-cell", "project-tab", "button"];
  static activeTabClass = "active-tab";
  static htmlContent = `<div class="project-cell-name-container">
                      <span class="project-cell-name">${title}</span>
                      <img src="" alt=" "  class="drop-arrow button" />
                      <div class="drop-down-content " id="edit-project">
                      <form action="" class="drop-down-form">
                        <ul class="drop-down-list">
                          <li>
                            <input
                              type="text"
                              class="drop-down-item button rename-project"
                              placeholder="Rename"
                            />
                          </li>
                          <li class="drop-down-item button delete-project">
                            Delete
                          </li>
                        </ul>
                      </form>
                    </div>
                    </div>
                    <div class="progress-bar-main-container">
                      <div class="progress-bar"></div>
                    </div>`;
  constructor(tabList) {
    this.tabList = tabList;
  }

  addTab(title, id, container) {
    //create unique id - kebab case title(lower case)

    console.log(`idTitle of tab ${title} is ${id}`);
    const newTab = new Tab(title, id);

    this.newElement = document.createElement(TabManager.typeOfElement);
    TabManager.classes.forEach((className) => {
      this.newElement.classList.add(className);
    });
    this.newElement.innerHTML = TabManager.htmlContent;
    this.newElement.setAttribute("id", id);
    container.appendChild(this.newElement);
    this.tabList.push(newTab);

    // visual active tab  toggle listener
    this.newElement.addEventListener("click", () => {
      Array.from(container.children).forEach((tab) => {
        tab.classList.remove(activeTabClass);
      });

      this.newElement.classList.toggle(activeTabClass);
    });
  }
  removeTab(id) {
    const index = this.tabList.findIndex((tab) => tab.idTab === id);
    if (index !== -1) {
      this.tabList.splice(index, 1);
    }
  }
  getTabs() {
    return this.tabList;
  }
  getTab(id) {
    const index = this.tabList.findIndex((tab) => tab.idTab === id);
    if (index !== -1) {
      return this.tabList[index];
    }
  }
}
