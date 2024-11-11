// --------------styles------------------------
import "./styles/style.css";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
// -------------------storage-----------------------
import LocalStorageManager from "./storage.js";
const localStorageManager = new LocalStorageManager();
// -----------------projects----------------------
import {
  
  Project,
  ProjectManager,
  Task,
  TaskManager,
} from "./projects.js";


//--------------Tabs------------------------
import {  Tab, TabManager } from "./tabs.js";


// --------------Validation-----------------
import {validateInput} from "./validation";
const { inputValidator, inputUniqueValidator } = validateInput();

console.log(inputUniqueValidator);

// =======IMAGES===========
import logoSrc from "./assets/images/logo.webp";
const logo = document.querySelector("#logo");
logo.src = logoSrc;

import dateSrc from "./assets/images/type date.webp";
const dateInputImg = document.querySelector("#custom-date-input");
dateInputImg.src = dateSrc;

// ----------DATE PICKER---------------
// new AirDatepicker("#el", {
//   dateFormat(date) {
//     return date.toLocaleString("ja", {
//       year: "numeric",
//       day: "2-digit",
//       month: "long",
//     });
//   },
// });

// ================= DRAFT ======================

class sortByDueDate {
  sort(tasks) {
    return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
}
class sortByPriority {
  sort(tasks) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return tasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }
}

const removeClass = (elements, selector) => {
  //check if iterable
  const elementList =
    NodeList.prototype.isPrototypeOf(elements) ||
    HTMLCollection.prototype.isPrototypeOf(elements) ||
    Array.isArray(elements)
      ? elements
      : [elements];
  elementList.forEach((element) => {
    element.classList.remove(selector);
  });
};
const submitEnter = (input, ...actions) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      console.log("submit enter initialized");

      for (const action of actions) {
        const result = action();
        if (result === null) {
          console.log("Action stopped");
          break;
        } else {
          console.log("Action executed");
        }
      }
    }
  });
};
const clearTextInput = (input) => (input.value = "");

const switchDisplay = (element) => {
  element.classList.toggle("hidden");
  console.log("element class list is:", element.classList);
  if (element.classList.contains("hidden")) {
    clearTextInput(projectTitleInput); // too tightly coupled???
  }
};
class DisplaySwitcher {
  toggle(element) {
    element.classList.toggle("hidden");
  }
}
class TextInputCleaner {
  clean(input) {
    input.value = "";
  }
}
const cleanerAndSwitcher = (element, input) => {
  const switcher = new DisplaySwitcher();
  const cleaner = new TextInputCleaner();

  switcher.toggle(element);
  if (element.classList.contains("hidden")) {
    cleaner.clean(input);
  }
  return { switcher, cleaner };
};

// const projectPanelStarter = (() => {
//   let projectPanel;
//   return {
//     initialize: () => {
//       if (!projectPanel) {
//         projectPanel = new ProjectPanel();
//         projectPanel.initialized();
//         return projectPanel;
//       } else {
//         console.log("projectPanel already exists!");
//       }
//     },
//   };
// })(); // I have to build local memory checker

// ----------------------GLOBAL LISTENERS---------------------
const addListener = (elements, type, action) => {
  //check if many
  if (
    NodeList.prototype.isPrototypeOf(elements) ||
    HTMLCollection.prototype.isPrototypeOf(elements)
  ) {
    elements.forEach((element) => {
      element.addEventListener(type, action);
    });
  } else {
    elements.addEventListener(type, action);
  }
};
const addParentListenerNearest = (
  type,
  selector,
  parent = document,
  callback
) => {
  parent.addEventListener(type, (e) => {
    console.log(`Clicked, ${e.target.classList}`);

    /*const nearestTarget = e.target.matches(selector)
      ? e.target
      : e.target.closest(selector);*/
    let nearestTarget = e.target;
    if (nearestTarget.matches(selector)) {
      nearestTarget = nearestTarget;
    } else {
      nearestTarget = e.target.closest(selector);
    }
    if (nearestTarget) {
      callback(e, nearestTarget);
    }
  });
}; // thanks, WDS
//debug  function
const checkProjectAndTabLists = () => {
  console.log("Projects list length: ", projectManager.projects.length);
  projectManager.projects.forEach((object) => {
    console.log("Project is ", object.title, object.id);
  });
  console.log("Tabs list length is ", tabManager.tabList.length);
  tabManager.tabList.forEach((tab) => {
    console.log("Tab is ", tab.title, tab.idTab);
  });
};
// =====================START=========================
// -------------storage-----------------------------------

// ----------projects,  tabs, arrays-------------------
const projectsKey = "projects";
const projects = [];
const tabsList = [];
const tabsKey = "tabList"
const tasksKey = "tasks";
const tasks= [];
localStorageManager.write(projectsKey, projects);
localStorageManager.write(tabsKey,tabsList);
localStorageManager.write(tasksKey , tasks);


// ---------------objects-----------------------------------
const projectList = document.querySelector("#project-list");
const projectManager = new ProjectManager(projectsKey, inputUniqueValidator);
const tabManager = new TabManager(tabsKey, projectManager, projectList);

const dropDown = document.getElementById("edit-project-2");
const arrows = document.querySelectorAll(".drop-arrow");
const tabs = document.querySelectorAll(".project-tab");

const addProjectBtn = document.querySelector("#add-project");
const addProjectQuery = document.querySelector("#add-project-query");
const projectTitleInput = document.querySelector("#project-title-input");






console.log("tabs array is", projectList.children);

// ------add starter listeners------------------
addListener(addProjectBtn, "click", () =>
  cleanerAndSwitcher(addProjectQuery, projectTitleInput)
);

submitEnter(
  projectTitleInput,
  () => projectManager.addProject(projectTitleInput),

 
  () => tabManager.addTab(projectList),
  () => {
    const cleaner = new TextInputCleaner();
    cleaner.clean(projectTitleInput);
  },
  () => addProjectQuery.classList.toggle("hidden")
);
//select current active tab
let activeTab = undefined;

//toggling active tab, style
addParentListenerNearest("click", ".project-tab", projectList, (e, target) => {
  //remove active-tab from other tabs
  const tabs = projectList.querySelectorAll(".project-tab");
  removeClass(tabs, "active-tab");
  target.classList.add("active-tab");
  activeTab = target;
  console.log("Active tab id is", activeTab.classList);
});
//showing drop down list with project editing
addParentListenerNearest("click", ".drop-arrow", projectList, (e, target) => {
  const thisTab = target.closest(".project-tab");
  const dropList = thisTab.querySelector(".drop-down-content");
  dropList.classList.toggle("visible");
});
//removing tab and project
addParentListenerNearest(
  "click",
  ".delete-project",
  projectList,
  (e, target) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      const parentTab = target.closest(".project-tab");
      const tabId = parentTab.id;
      projectManager.removeProject(tabId);
      console.log(
        `Projects array after removing  ${tabId} is ${projectManager.projects.length}`
      );
      tabManager.removeTab(tabId, parentTab);
    } else {
      console.log("User chose not to remove the project");
    }
  }
);
//rename tab/project
addParentListenerNearest(
  "keypress",
  ".rename-project",
  projectList,
  (e, target) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const parentTab = target.closest(".project-tab");
      const inputRename = target.closest(".rename-project");
      console.log("ParenTab id is: ", parentTab.id);
      const tabId = parentTab.id;
      projectManager.renameProject(tabId, inputRename);
      const renamedProject =
        projectManager.getLastModifiedProject();
      tabManager.renameTab(renamedProject, parentTab);

      console.log("Input rename is:  ", inputRename);
      clearTextInput(inputRename);
      checkProjectAndTabLists();
    }
  }
);
