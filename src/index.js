// --------------styles------------------------
import "./styles/style.css";

// -------------------storage-----------------------
import LocalStorageManager from "./storage.js";
const localStorageManager = new LocalStorageManager();
// -----------------projects----------------------
import { Project, ProjectManager } from "./projects.js";
//--------------Tabs---------------------------
import { Tab, TabManager } from "./tabs.js";
// -------------------tasks---------------------------
import { Task, TaskManager } from "./tasks.js";
//-------------task bars-----------------------
import { TaskBar, TaskBarManager } from "./bars.js";

// --------------Validation-----------------
import { validateInput } from "./validation";
const { inputValidator, inputUniqueValidator } = validateInput();
// -------------------time---------------------
import { format } from "date-fns";

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

class DisplaySwitcher {
  toggle(element) {
    element.classList.toggle("hidden");
  }
}
class TextInputCleaner {
  clean(inputs) {
    const elementList =
      NodeList.prototype.isPrototypeOf(inputs) ||
      HTMLCollection.prototype.isPrototypeOf(inputs) ||
      Array.isArray(inputs)
        ? inputs
        : [inputs];
    elementList.forEach((element) => {
      element.value = "";
    });
  }
}
export const cleanerAndSwitcher = (element, input) => {
  const switcher = new DisplaySwitcher();
  const cleaner = new TextInputCleaner();
  switcher.toggle(element);
  if (element.classList.contains("hidden")) {
    cleaner.clean(input);
  }
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
  const projects = localStorageManager.read(projectsKey);
  console.log("Projects list length: ", projectManager.projects);
  projects.forEach((object) => {
    console.log(
      `Project is  ${object.title}, ${object.id} and tasks are ${object.tasks.length} `
    );
  });
  console.log("Tabs list length is ", tabManager.tabList.length);
  tabManager.tabList.forEach((tab) => {
    console.log("Tab is ", tab.title, tab.idTab);
  });
  console.log;
  taskManager.tasks.forEach((task) => {
    console.log(`Task ${task.id} of project ${task.projectAssigned}`);
  });
  console.log(`Task bars are ${localStorageManager.read(taskBarsKey)}`);
};
// =====================START=========================
// -------------storage-----------------------------------

// ----------projects,  tabs, arrays-------------------
const projectsKey = "projects";
const projects = [];
const tabsList = [];
const tabsKey = "tabList";
const taskBarsKey = "tasks";
const tasks = [];
localStorageManager.write(projectsKey, projects);
localStorageManager.write(tabsKey, tabsList);
localStorageManager.write(taskBarsKey, tasks);

// ---------------objects projects-----------------------------------
const projectList = document.querySelector("#project-list");
const projectManager = new ProjectManager(projectsKey);
const tabManager = new TabManager(tabsKey, projectManager, projectList);
const addProjectBtn = document.querySelector("#add-project");
const addProjectQuery = document.querySelector("#add-project-query");
const projectTitleInput = document.querySelector("#project-title-input");

console.log("tabs array is", projectList.children);

// add default project
const loadDefault = () => {
  if (!projectManager.getProject("Default")) {
    const project = new Project("Default");
    projectManager.projects.push(project);
    projectManager.saveProjectsToStorage();
  } else {
    console.log("Default project already exists");
  }
};
loadDefault();
// ------add starter listeners------------------

//load rebuild tabs with projects  from tabManger.tabList localStorage
window.addEventListener(
  "load",
  tabManager.loadElementsFromStorage(projectList)
);

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
let activeTab = document.querySelector(".active-tab ");
let activeTaskBar = null;
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

      console.log(
        `Projects array after removing  ${tabId} is ${projectManager.projects.length}`
      );
      taskBarManager.removeTaskBars(tabId);
      tabManager.removeTab(tabId, parentTab);
      projectManager.removeProject(tabId, taskBarsContainer);
    } else {
      console.log("User choose not to remove the project");
    }
  }
);
//toggling active tab, style and load task bars
addParentListenerNearest("click", ".project-tab", projectList, (e, target) => {
  //remove active-tab from other tabs
  const tabs = projectList.querySelectorAll(".project-tab");
  removeClass(tabs, "active-tab");
  target.classList.add("active-tab");
  activeTab = target;
  console.log("Active tab id is", activeTab.id);
  console.log("TaskManager tasks are: ", taskManager.tasks);

  //load task bars
  taskManager.updateProjectsProjectTasks();
  console.log("TaskManager tasks are: ", taskManager.tasks);

  taskBarsContainer.innerHTML = " ";
  console.log("Task bar list", taskBarManager.taskBarsList);
  taskBarManager.loadElementsFromStorage(taskBarsContainer, activeTab);
  checkProjectAndTabLists();
});

//showing drop down list with project editing
addParentListenerNearest("click", ".drop-arrow", projectList, (e, target) => {
  const thisTab = target.closest(".project-tab");
  const dropList = thisTab.querySelector(".drop-down-content");
  dropList.classList.toggle("visible");
});

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
      console.log("ParentTab id is ", tabId);
      const oldProjectId = tabId;
      projectManager.renameProject(tabId, inputRename);

      const renamedProject = projectManager.getLastModifiedProject();
      console.log("New project  id is ", renamedProject.id);
      tabManager.renameTab(renamedProject, parentTab);
      taskBarManager.reassignTaskBars(oldProjectId, renamedProject.id);

      console.log("Input rename is:  ", inputRename);
      clearTextInput(inputRename);
    }
  }
);
//----------------objects tasks-----------------------------
const addTaskBtn = document.querySelector("#add-task-button");
const newTaskContainer = document.querySelector(".new-task-container");
const inputsForCleaning = document.querySelectorAll(".input-for-cleaning");
const taskManager = new TaskManager(projectsKey);
const taskBarsContainer = document.querySelector("#task-list");
const taskBarManager = new TaskBarManager(
  taskBarsKey,
  taskManager,
  taskBarsContainer
);

//submitting new task form
// element should be assign after site loads, maybe after the plus btn is clicked?
const newTaskTitleInput = document.querySelector(".new-task-title");
const startDateInput = document.querySelector("#date-range-start");
const endDateInput = document.querySelector("#date-range-end");
const lowInput = document.querySelector("#low"); //if clicked, toggle class clicked
const mediumInput = document.querySelector("#medium");
const highInput = document.querySelector("#high");
let clickedPriority = document.querySelector(".clicked");
const descriptionInput = document.querySelector("#description");
const submitTaskBtn = document.querySelector("#submit-task-button");
//listeners

//-------------tasks listeners-----------------
// toggling active task bar

addParentListenerNearest(
  "click",
  ".task-bar-item",
  taskBarsContainer,
  (e, target) => {
    const taskBars = taskBarsContainer.querySelectorAll(".task-bar-item");
    removeClass(taskBars, "active-task-bar");
    target.classList.add("active-task-bar");
    // const parentTaskItem = target.closest(".task-bar-item");
    activeTaskBar = target;
    console.log("Active task bar is ", activeTaskBar.id);
  }
);
//adding task
addListener(addTaskBtn, "click", () => {
  if (!newTaskContainer.classList.contains("for-edit")) {
    cleanerAndSwitcher(newTaskContainer, inputsForCleaning);
    console.log("newTaskContainer, cleaned");
  } else {
    cleanerAndSwitcher(newTaskContainer, inputsForCleaning);
    console.log("active task bar is: ", activeTaskBar.id);
    const oldTask = taskManager.getTask(activeTaskBar);
    console.log("oldTask is: ", oldTask);
    console.log("oldTask id is ", oldTask.id);
    newTaskTitleInput.value = oldTask.title;
    console.log("newTaskTitleInput.value is: ", newTaskTitleInput.value);
    startDateInput.value = oldTask.startDate;
    console.log("startDateInput.value is: ", startDateInput.value);
    endDateInput.value = oldTask.endDate;
    console.log("endDateInput.value is: ", endDateInput.value);
    descriptionInput.value = oldTask.description;
    console.log("descriptionInput.value is:", descriptionInput.value);
  }
});
//choose priority;

const priorityElements = [lowInput, mediumInput, highInput];
priorityElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    priorityElements.forEach((element) => element.classList.remove("clicked"));
    e.target.classList.toggle("clicked");
    clickedPriority = document.querySelector(".clicked");
    console.log("Clicked priority ", clickedPriority.id);
  });
});
//add new task

// const thisEditButTon = document.querySelector(active-task-bar > edit);

submitTaskBtn.addEventListener("click", () => {
  const title = newTaskTitleInput;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const priority = clickedPriority.id;
  const projectAssigned = activeTab.id;
  const description = descriptionInput.value;
  if (!newTaskContainer.classList.contains("for-edit")) {
    const addTaskCheck = taskManager.addTask({
      title,
      startDate,
      endDate,
      priority,
      projectAssigned,
      description,
    });

    //add task bar
    addTaskCheck == 1
      ? taskBarManager.addTaskBar(taskBarsContainer)
      : console.warn("Cannot add taskBar");

    cleanerAndSwitcher(newTaskContainer, inputsForCleaning);
  } else {
    // edit task and add taskBar
    const editTaskCheck = taskManager.editTask(
      activeTaskBar,
      title,
      startDate,
      endDate,
      priority,
      description
    );
    editTaskCheck == 1
      ? taskBarManager.editTaskBar()
      : console.warn("Cannot edit taskBar");

    console.log("talsbar list is ", taskBarManager.taskBarsList);
    taskBarManager.loadElementsFromStorage(taskBarsContainer, activeTab);
    newTaskContainer.classList.remove("for-edit");

    cleanerAndSwitcher(newTaskContainer, inputsForCleaning);
  }
});

checkProjectAndTabLists();
console.log("TaskManager task are: ", taskManager.tasks);
console.log("TaskManager projects are: ", taskManager.projects);
