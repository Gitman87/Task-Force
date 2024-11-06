
// --------------styles------------------------
import "./styles/style.css";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
// -----------------projects----------------------
import {ProjectPanel, Project, ProjectManager, Task, TaskManager} from "./projects.js"

//--------------Tabs------------------------
import { TabPanel, Tab, TabManager } from './tabs.js';


// --------------Validation-----------------
import { validateInput } from "./validation";
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

// =================DRAFT===================



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
          break; // Stop executing further actions if `null` is returned
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
  // clearTextInput(projectTitleInput);
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

const projectPanelStarter = (() => {
  let projectPanel;
  return {
    initialize: () => {
      if (!projectPanel) {
        projectPanel = new ProjectPanel();
        projectPanel.initialized();
        return projectPanel;
      } else {
        console.log("projectPanel already exists!");
      }
    },
  };
})();// I have to build local memory checker

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

// =====================START=========================
const projectList = document.querySelector("#project-list");
// const projectPanel = projectPanelStarter.initialize();
const projectPanel = new ProjectPanel(inputUniqueValidator);
const tabPanel = new TabPanel(projectList, projectPanel);
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
  () => projectPanel.projectManager.addProject(projectTitleInput),

  // () => makeTab(projectPanel.projectManager.getLastProject(), projectList),
  ()=> tabPanel.tabManager.addTab(projectList),
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
addParentListenerNearest("click", ".delete-project", projectList, (e, target) => {
  const confirmation = confirm("Are you sure?");
  if(confirmation){
  const parentTab = target.closest(".project-tab");
  const tabId = parentTab.id;
  projectPanel.projectManager.removeProject(tabId);
  console.log(`Projects array after removing  ${tabId} is ${projectPanel.projects.length}`);
  tabPanel.tabManager.removeTab(tabId, parentTab);
  }
  else{
    console.log("User chose not to remove the project");
  }
  
});
//rename tab/project
addParentListenerNearest("enter", ".rename-project", projectList, (e,target)=>{
  const parentTab = target.closest(".project-tab");
  const inputRename = target.closest(".rename-project") 
  const tabId = parentTab.id;
  projectPanel.projectManager.renameProject(tabId, inputRename);
  console.log("Input rename is", inputRename);
  
})




