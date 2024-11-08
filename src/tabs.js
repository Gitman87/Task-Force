export class TabPanel {
  constructor(container, projectPanel) {
    this.container = container;
    this.tabList = [];
    this.tabManager = new TabManager(this.tabList, projectPanel);
    this.projectPanel = projectPanel;
  }
  initialized() {
    console.log("TabPanel  initialized!");
  }
}
export class Tab {
  constructor(title, id) {
    this.title = title;
    this.idTab = id;
  }
}
export class TabManager {
  static typeOfElement = "li";
  static classes = ["project-list-cell", "project-tab", "button"];
  static activeTabClass = "active-tab";
  static getHtmlContent(title) {
    return `<div class="project-cell-name-container">
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
  }
  constructor(tabList, projectPanel) {
    this.tabList = tabList;
    this.projectPanel = projectPanel;
  }
  _getNewestProjects() {
    const newestProjects = this.projectPanel.projectManager.getProjects();
    return newestProjects;
  }

  addTab(container) {
    //select last added project
    const newestProjects = this.projectPanel.projectManager.getProjects();
    const project = newestProjects[newestProjects.length - 1];
    const title = project.title;
    const id = project.id;

    console.log(`idTitle of tab ${title} is ${id}`);
    const newTab = new Tab(title, id);
    this.tabList.push(newTab);
    const newElement = document.createElement("li");
    newElement.innerHTML = TabManager.getHtmlContent(title);

    TabManager.classes.forEach((className) => {
      newElement.classList.add(className);
    });

    newElement.setAttribute("id", id);
    container.appendChild(newElement);
  }

  removeTab(id, tab) {
    // const projects = this.projectPanel.getProjects();
    const tabIndex = this.tabList.findIndex((tab) => tab.idTab === id);

    if (tabIndex === -1) {
      console.warn("Cannot remove tab- not found");
      return;
    }
    const tabToRemove = this.tabList[tabIndex];
    const projectTitle = tabToRemove.title;

    //remove tab
    this.tabList.splice(tabIndex, 1);
    console.log(
      `Tab with id: ${tabToRemove.idTab} removed for project title: ${projectTitle}`
    );
    tab.remove();
  }
  renameTab(renamedProject, parentTab) {
    if (renamedProject) {
      const oldTab = this.getTab(parentTab.id)[0];
      this.tabList[this.getTab(parentTab.id)[1]].title = renamedProject.title;
      this.tabList[this.getTab(parentTab.id)[1]].idTab = renamedProject.id;
      parentTab.id = renamedProject.id;
      //rename title html element
      const titleElement = parentTab.querySelector(".project-cell-name");
      titleElement.innerHTML = "";
      titleElement.innerHTML = renamedProject.title;
    } else {
      console.log("nic z tego mlody paadawanie");
    }
  }
  getTabs() {
    return this.tabList;
  }
  getTab(id) {
    const index = this.tabList.findIndex((tab) => tab.idTab === id);
    if (index !== -1) {
      return [this.tabList[index], index];
    }
  }
  getActiveTab(container, selector) {
    const activeTabElement = container.querySelector(selector);
    const activeTabObjectIndex = this.tabList.indexOf(
      (tab) => tab.id === activeTabElement.id
    );
    const activeTabObject = this.tabList[activeTabObjectIndex];
    return { activeTabElement, activeTabObject };
  }
}

// const projectList = document.querySelector("#project-list");
// const tabPanel = new TabPanel(projectList, projectPanel);
// const actions = {
//   "delete-project": (e)=>
//     tabPanel.tabManager.
// }

// -----------------for analizing ----------

// const addGlobalListener = (type, selector, callback) => {
//   document.addEventListener(type, (e) => {
//     if (e.target.matches(selector)) {
//       callback();
//     }
//   });
// }; // thanks, WDS
// addGlobalListener("click", ".project-tab", (e) => {
//   e.target.classList.toggle("active-tab");
// });
