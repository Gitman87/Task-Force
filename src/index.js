import "./styles/style.css";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
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
new AirDatepicker("#el", {
  dateFormat(date) {
    return date.toLocaleString("ja", {
      year: "numeric",
      day: "2-digit",
      month: "long",
    });
  },
});

// =================DRAFT===================

class ProjectPanel {
  constructor() {
    this.projects = [];
    this.projectManager = new ProjectManager(this.projects);
  }
  initialized() {
    console.log("Project Panel initialized!");
  } // check if created
}
class Project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.progress = 0;
    this.taskManager = new TaskManager(this.tasks);
    this.idTab = title.split(" ").join("-").toLowerCase();
  }
}
class ProjectManager {
  constructor(projects) {
    this.projects = projects;
  }

  addProject(input, checkIfEmpty, checkIfUnique) {
    const isEmptyValid = checkIfEmpty();
    const isUniqueValid = checkIfUnique();
    if (isEmptyValid && isUniqueValid) {
      const project = new Project(input.value);
      console.log(`addProject project title is: ${project.title}`);
      this.projects.push(project);
      console.log(`Project added: ${this.projects[0].title}`);
    } else {
      if (!isEmptyValid) alert("Project title cannot be empty!");
      if (!isUniqueValid) alert("Project title already exists!");
      console.warn("Project validation failed.");
    }
  }
  removeProject(title) {
    const index = this.projects.findIndex((project) => project.title === title);
  if (index !== -1) {
    this.projects.splice(index, 1);
    console.log("removed project name:",title)
    return true; 
  }
  else{
    console.warn("ProjectPanel couldn't remove project", title);
    return false;}
  }
  getProjects() {
    return this.projects;
  }
  getProject(title) {
    const index = this.projects.findIndex((project) => project.title === title);
    if (index !== -1) {
      return this.projects[index];
    }
  }

  sortProjects(strategy) {
    strategy.sort(this.projects);
  }
}

class Task {
  constructor({
    title,
    dueDate = "17-10-2024",
    priority = "low",
    projectAssigned = "defaultProject",
    isComplete = false,
    description = "",
  } = {}) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectAssigned = projectAssigned;
    this.isComplete = isComplete;
    this.description = description;
  }
}

class TaskManager {
  constructor(tasks) {
    this.tasks = tasks;
  }
  addTask({
    title,
    dueDate = "17-10-2024",
    priority = "low",
    projectAssigned = "defaultProject",
    isComplete = false,
    description = "",
  }) {
    const task = new Task({
      title,
      dueDate,
      priority,
      projectAssigned,
      isComplete,
      description,
    });
    this.tasks.push(task);
  }
  removeTask(title) {
    const index = this.tasks.findIndex((task) => task.title === title);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  getTask(title) {
    const index = this.tasks.findIndex((task) => task.title === title);
    if (index !== -1) {
      return this.tasks[index];
    }
  }
  getTasks() {
    return this.tasks;
  }
  sortTasks(strategy) {
    strategy.sort(this.tasks);
  }
  calculateProgress() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.isComplete).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }
}

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
// =============================DOM================================
const addProjectBtn = document.querySelector("#add-project");
const addProjectQuery = document.querySelector("#add-project-query");
const projectTitleInput = document.querySelector("#project-title-input");
const projectList = document.querySelector("#project-list");
console.log("tabs array is", projectList.children);

// const addAction = (elements, ...args) => {
//   let event, action;
//   if (args.length === 1) {
//     event = "click";
//     action = args[0];
//   } else {
//     event = args[0];
//     action = args[1];
//   }

//   if (
//     NodeList.prototype.isPrototypeOf(elements) ||
//     HTMLCollection.prototype.isPrototypeOf(elements) ||
//     Array.isArray(elements)
//   ) {
//     elements.forEach((element) => {
//       element.addEventListener(event, action);
//     });
//   } else {
//     elements.addEventListener(event, action);
//   }
// };

// ------adding listeners to objects with particular classes-------







const addListener = (elements, action) => {
  // Define the mapping of classes to events
  const eventMap = {
    enter: "keypress",
    button: "click",
    hover: "mouseover" // if ether will be need
  };

  // check if iterable elements (selectorAll)
  const elementList = NodeList.prototype.isPrototypeOf(elements) ||
                      HTMLCollection.prototype.isPrototypeOf(elements) ||
                      Array.isArray(elements)
    ? elements
    : [elements];

  
  elementList.forEach((element) => {
    // Find the first class in eventMap that matches an element's class
    const eventType = Object.keys(eventMap).find((className) =>
      element.classList.contains(className)
    );

    // If an event type is found based on the class, use it; otherwise, default to 'click'
    const event = eventType ? eventMap[eventType] : "click";

    // Add the event listener with the determined event type
    element.addEventListener(event, (e) => {
      // Optionally check for specific keys if 'enter' class and 'keypress' event
      if (event === "keypress" && e.key !== "Enter") return;
      action(e);
    });
  });
};
const changeElementAttribute = (element, attribute) => {
  if (!element.hasAttribute(attribute)) {
    element.setAttribute(attribute, attribute);
    element.offsetHeight;
  } else {
    element.removeAttribute(attribute);
    element.offsetHeight;
  }
};

const submitEnter = (input, ...actions) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      // event.preventDefault();
      console.log("submit enter initialized");
      console.log(actions);
      actions.forEach((action) => {
        action();
        console.log("action done");
      });
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
// -----------LOCAL STORAGE---------
const serializeObject = (object) => {
  return JSON.stringify(object);
};
const parseObject = (serializedObject) => {
  return JSON.parse(serializedObject);
};
const recordToLocalStorage = (keyName, item) => {
  localStorage.setItem(keyName, item);
};
const readFromLocalStorage = (keyName) => {
  return localStorage.getItem(keyName);
};

// -----SUBMIT NEW PROJECT FORM-------
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
})();

// =====================START=========================
const projectPanel = projectPanelStarter.initialize();
const dropDown = document.getElementById("edit-project");
const arrow = document.querySelector(".drop-arrow");

arrow.addEventListener("click", () => {
  dropDown.classList.toggle("visible");
});

// ----- OPEN DIALOG------
addListener(addProjectBtn, () =>
  cleanerAndSwitcher(addProjectQuery, projectTitleInput)
);

submitEnter(
  projectTitleInput,
  () =>
    projectPanel.projectManager.addProject(
      projectTitleInput,
      () => inputValidator.isEmpty(projectTitleInput),
      () =>
        inputUniqueValidator.isUnique(
          projectPanel.projectManager.projects,
          projectTitleInput
        )
    ),
  () => makeTab(projectTitleInput.value, projectList),
  () => {
    const cleaner = new TextInputCleaner();
    cleaner.clean(projectTitleInput);
  },
  () => addProjectQuery.classList.toggle("hidden")
);

// -------------------CREATE NEW TAB FACTORY---------------
const makeTab = (title, container, activeTabClass = "active-tab") => {
  class ProjectTab {
    static typeOfElement = "li";
    static classes = [
      "project-list-cell",
      "project-tab",
      "button"
      
    ];
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

    constructor(title) {
      this.title = title;
    }

    addTab(container) {
      this.newElement = document.createElement(ProjectTab.typeOfElement);
      ProjectTab.classes.forEach((className) => {
        this.newElement.classList.add(className);
      });
      this.newElement.innerHTML = ProjectTab.htmlContent;
      container.appendChild(this.newElement);
      // visual active tab  toggle listener
      this.newElement.addEventListener("click", () => {
        Array.from(container.children).forEach((tab) => {
          tab.classList.remove(activeTabClass);
        });

        this.newElement.classList.toggle(activeTabClass);
      });
    }
    
  }

  if (title) {
    const newTab = new ProjectTab(title);
    // newTab.toggleActiveTab(container, activeTabClass);
    newTab.addTab(container);
    
  } else {
    console.warn("Cannot create new tab- title input is empty");
  }
};
