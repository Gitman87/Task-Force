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

// =======IMAGES===========
import logoSrc from "./assets/images/logo.webp";
const logo = document.querySelector("#logo");
logo.src = logoSrc;

function toggleDialog(element) {
  const dialog = document.getElementById("myDialog");
  if (element.open) {
    element.close();
  } else {
    element.showModal();
  }
}
function cleanInputs(inputs) {
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

const removeClass = (elements, selector) => {
  //check if iterable
  const elementList =
    NodeList.prototype.isPrototypeOf(elements) ||
    HTMLCollection.prototype.isPrototypeOf(elements) ||
    Array.isArray(elements)
      ? elements
      : [elements];
  elementList.forEach((element) => {
    if (element.classList.contains(selector)) {
      element.classList.remove(selector);
    } else {
    }
  });
};
const submitEnter = (input, ...actions) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      for (const action of actions) {
        const result = action();
        if (result === null) {
          break;
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
const counter = document.querySelector("#count-button-number");

function loadToday() {
  if (!projectManager.getProject("Today")) {
    const project = new Project("Today");
    projectManager.projects.push(project);
    projectManager.saveProjectsToStorage();

    tabManager.addTab(projectList);
    // tabManager.loadElementsFromStorage(projectList);
  } else {
    tabManager.loadElementsFromStorage(projectList);
  }
}
loadToday();
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

      taskBarManager.removeTaskBars(tabId);
      tabManager.removeTab(tabId, parentTab);

      projectManager.removeProject(tabId, taskBarsContainer);
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

  //load task bars
  taskManager.updateProjectsProjectTasks();

  taskBarsContainer.innerHTML = " ";

  taskBarManager.loadElementsFromStorage(taskBarsContainer, activeTab);
  if (activeTab.id != "today") {
    const number = taskManager.countIncomplete();
    counter.textContent = number;
  }

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

      const tabId = parentTab.id;

      const oldProjectId = tabId;
      projectManager.renameProject(tabId, inputRename);

      const renamedProject = projectManager.getLastModifiedProject();

      tabManager.renameTab(renamedProject, parentTab);
      taskBarManager.reassignTaskBars(oldProjectId, renamedProject.id);

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
    if (activeTab.id === "today") {
      const taskBars = taskBarsContainer.querySelectorAll(".task-bar-item");
      removeClass(taskBars, "active-task-bar");
      target.classList.add("active-task-bar");
      // const parentTaskItem = target.closest(".task-bar-item");
      activeTaskBar = target;

      const confirmation = confirm("Do you want to see project?");
      if (confirmation) {
        const datasetValue = activeTaskBar.getAttribute(
          "data-project-assigned"
        );

        const destinyTab = document.getElementById(datasetValue);

        destinyTab.click();
        const destinyTaskBar = document.getElementById(target.id);

        destinyTaskBar.classList.add("active-task-bar");

        // tabManager.getTab(task.)
      }
    } else {
      const taskBars = taskBarsContainer.querySelectorAll(".task-bar-item");
      removeClass(taskBars, "active-task-bar");
      target.classList.add("active-task-bar");

      activeTaskBar = target;
    }
  }
);
//adding task
addListener(addTaskBtn, "click", () => {
  if (activeTab) {
    if (activeTab.id != "today") {
      if (!newTaskContainer.classList.contains("for-edit")) {
        toggleDialog(newTaskContainer);
        cleanInputs(inputsForCleaning);
      } else {
        toggleDialog(newTaskContainer);
        cleanInputs(inputsForCleaning);

        const oldTask = taskManager.getTask(activeTaskBar);

        newTaskTitleInput.value = oldTask.title;

        startDateInput.value = oldTask.startDate;

        endDateInput.value = oldTask.endDate;

        descriptionInput.value = oldTask.description;
      }
    } else {
      alert(
        "This tab aggregates all the tasks for today automatically. Choose different tab/project or create new one by pressing plus button at the top of the projects panel."
      );
    }
  } else {
    alert("Choose tab or create new project and click on its tab");
  }
});
//choose priority;

const priorityElements = [lowInput, mediumInput, highInput];
priorityElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    priorityElements.forEach((element) => element.classList.remove("clicked"));
    e.target.classList.toggle("clicked");
    clickedPriority = document.querySelector(".clicked");
  });
});
//add new task

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
      ? taskBarManager.addTaskBar()
      : console.warn("Cannot add taskBar");

    toggleDialog(newTaskContainer);
    cleanInputs(inputsForCleaning);
    changeProgress();
    if (activeTab.id != "today") {
      const number = taskManager.countIncomplete();
      counter.textContent = number;
    }
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

    taskBarManager.loadElementsFromStorage(taskBarsContainer, activeTab);
    newTaskContainer.classList.remove("for-edit");

    toggleDialog(newTaskContainer);
    cleanInputs(inputsForCleaning);
  }
});
//deleting task
addParentListenerNearest(
  "click",
  ".delete-button",
  taskBarsContainer,
  (e, target) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      const parentTaskBar = target.closest(".task-bar-item");
      target.classList.toggle("clicked");
      const taskBarId = parentTaskBar.id;
      taskManager.removeTask(taskBarId);
      taskBarManager.removeTaskBar(taskBarId);
      taskBarManager.loadElementsFromStorage(taskBarsContainer, activeTab);

      const progressNumber = taskManager.calculateProgress();

      const projectId = taskManager.getActiveProjectId();
      projectManager.changeProgress(projectId, progressNumber);

      tabManager.changeProgress(activeTab, progressNumber);

      changeProgress();
      if (activeTab.id != "today") {
        const number = taskManager.countIncomplete();
        counter.textContent = number;
      }
    }
  }
);
//marking complete task
addParentListenerNearest("click", ".done", taskBarsContainer, (e, target) => {
  const parentTaskBar = target.closest(".task-bar-item");
  const taskBarId = parentTaskBar.id;
  target.classList.toggle("marked");
  let trueOrFalse = false;
  if (target.classList.contains("marked")) {
    trueOrFalse = true;
    taskManager.isComplete(parentTaskBar, trueOrFalse);
  } else {
    taskManager.isComplete(parentTaskBar, trueOrFalse);
  }
  taskBarManager.isComplete(parentTaskBar.id);
  //change progress
  const progressNumber = taskManager.calculateProgress();

  const projectId = taskManager.getActiveProjectId();
  projectManager.changeProgress(projectId, progressNumber);

  tabManager.changeProgress(activeTab, progressNumber);

  changeProgress();
  if (activeTab.id != "today") {
    const number = taskManager.countIncomplete();
    counter.textContent = number;
  }
});
function changeProgress() {
  const progressNumber = taskManager.calculateProgress();

  const projectId = taskManager.getActiveProjectId();
  projectManager.changeProgress(projectId, progressNumber);

  tabManager.changeProgress(activeTab, progressNumber);

  const progressBar = activeTab.querySelector(".progress-bar");

  if (progressNumber == 100) {
    progressBar.style.backgroundColor = "var(--brightest)";
    progressBar.style.width = progressNumber + "%";
  } else {
    progressBar.style.backgroundColor = "var(--reddish)";

    progressBar.style.width = progressNumber + "%";
  }
}
//dark mode and clearing storage
const arrowBtnDarkMode = document.querySelector("#dark-mode-arrow");
const darkModeList = document.querySelector("#dark-mode-list");
const clearMemoryBtn = document.querySelector(".clear-memory");
const darkModeBtn = document.querySelector(".dark-mode");

arrowBtnDarkMode.addEventListener("click", () => {
  darkModeList.classList.toggle("visible");
});
clearMemoryBtn.addEventListener("click", () => {
  const confirmation = confirm("Are you sure?");
  if (confirmation) {
    localStorage.clear();
    window.location.reload();
  }
});
darkModeBtn.addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
});
