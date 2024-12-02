// export class TabPanel {
//   constructor(container, projectManager) {
//     this.container = container;
//     this.tabList = [];
//     this.tabManager = new TabManager(this.tabList, projectManager);
//     this.projectPanel = projectPanel;
//   }
//   initialized() {
//     console.log("TabPanel  initialized!");
//   }
// }
import LocalStorageManager from "./storage";
import { format } from "date-fns";
export class Tab {
  constructor(title, id) {
    this.title = title;
    this.idTab = id;
    this.progress = 0;
  }
}
export class TabManager {
  static typeOfElement = "li";
  static classes = ["project-list-cell", "project-tab", "button"];
  static activeTabClass = "active-tab";
  static today =new Date();
  static todayDate =  format(new Date(),"dd-MM-yyyy");
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
  constructor(tabsKey, projectManager, container) {
    this.tabsKey = tabsKey;
    this.localStorageManager = new LocalStorageManager();
    this.tabList = this.loadTabsFromStorage() || [];
    this.projectManager = projectManager;
    this.container = container;
  }
  _getNewestProjects() {
    const newestProjects = this.projectManager.getProjects();
    return newestProjects;
  }
  loadTabsFromStorage() {
    return this.localStorageManager.read(this.tabsKey);
  }
  saveTabsToStorage() {
    return this.localStorageManager.update(this.tabsKey, this.tabList);
  }
  loadElementsFromStorage(container) {
    this.tabList.forEach((tab) => {
      const newElement = document.createElement(TabManager.typeOfElement);
      newElement.innerHTML = TabManager.getHtmlContent(tab.title);
      TabManager.classes.forEach((className) => {
        if(tab.id==="today"){
        newElement.classList.add(className, "active-tab");
        

        }
        else{
          newElement.classList.add(className);
        }

      });
      newElement.setAttribute("id", tab.idTab);
      const progressBar = newElement.querySelector(".progress-bar");
      if(tab.progress== 100){
        progressBar.style.backgroundColor = "var(--brightest)";
        progressBar.style.width = tab.progress+"%";
        
      }
      else{
        progressBar.style.backgroundColor = "var(--reddish)";

        progressBar.style.width = tab.progress+"%";
      }
      container.appendChild(newElement);
    });
  }
  addTab(container) {
    //select last added project
    const newestProjects = this.projectManager.getProjects();
    const project = newestProjects[newestProjects.length - 1];
    const title = project.title;
    const id = project.id;
    console.log(`idTitle of tab ${title} is ${id}`);
    const newTab = new Tab(title, id);
    this.tabList.push(newTab);
    this.saveTabsToStorage();
    const newElement = document.createElement(TabManager.typeOfElement);
    newElement.innerHTML = TabManager.getHtmlContent(title);

    TabManager.classes.forEach((className) => {
      newElement.classList.add(className);
    });

    newElement.setAttribute("id", id);
    container.appendChild(newElement);
  }

  removeTab(id, tab) {
    const tabIndex = this.tabList.findIndex((tab) => tab.idTab === id);

    if (tabIndex === -1) {
      console.warn("Cannot remove tab - not found");
      return;
    }
    const tabToRemove = this.tabList[tabIndex];
    const projectTitle = tabToRemove.title;

    //remove tab
    this.tabList.splice(tabIndex, 1);
    this.saveTabsToStorage();
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
      this.saveTabsToStorage();
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
  changeProgress(tab, progress) {
    console.log("Tab id is", tab);
    const index = this.tabList.findIndex((item) => item.idTab === tab.id);
    if (index !== -1) {
     this.tabList[index].progress = progress;
     console.log("Tab's object changed its progress to ", this.tabList[index].progress )
    }
    else {
      console.warn("Couldn't change tab's object progress");
    }

    
    
    this.saveTabsToStorage();
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
