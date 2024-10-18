import "./styles/style.css";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
// =======IMAGES===========
import logoSrc from "./assets/images/logo.webp";
const logo = document.querySelector("#logo");
logo.src = logoSrc;

import dateSrc from "./assets/images/type date.webp";
const dateInputImg = document.querySelector("#custom-date-input");
dateInputImg.src = dateSrc;

// import dropArrowSrc from "./assets/images/drop_down_arrow.webp";
// const dropArrows = document.querySelectorAll(".drop-arrow");
// dropArrows.forEach((dropArrow) => (dropArrow.src = dropArrowSrc));

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
// task-object factory
// function createTask({
//   title,
//   dueDate,
//   priority,
//   projectAssigned,
//   is_finished = false,
// }) {
//   return {
//     title,
//     dueDate,
//     priority,
//     projectAssigned,
//     is_finished,
//   };
// }
//example
// tasks.push(
//   createTask({
//     title: "Fix electricity",
//     dueDate: 17 - 10 - 1987,
//     priority: "medium",
//     projectAssigned: projects[0].name,
//   })
// );
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
    this.completion = 0;
    this.taskManager = new TaskManager(this.tasks);
  }
}
class ProjectManager {
  constructor(projects) {
    this.projects = projects;
  }

  addProject(input) {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const project = new Project(input.value);
        this.projects.push(project);
        // create tab
      }
    });
  }
  removeProject(title) {
    const index = this.projects.findIndex((project) => project.title === title);
    if (index !== -1) {
      this.projects.splice(index, 1);
    }
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
// console.log(`addProjectBtn selector is: ${addProjectBtn.id}`);
const addProjectQuery = document.querySelector("#add-project-query");
const projectTitleInput = document.querySelector("#project-title-input");
const projectList = document.querySelector("#project-list");

const addAction = (elements, ...args) => {
  let event, action;
  if (args.length === 1) {
    event = "click";
    action = args[0];
  } else {
    event = args[0];
    action = args[1];
  }

  if (
    NodeList.prototype.isPrototypeOf(elements) ||
    HTMLCollection.prototype.isPrototypeOf(elements) ||
    Array.isArray(elements)
  ) {
    elements.forEach((element) => {
      element.addEventListener(event, action);
    });
  } else {
    elements.addEventListener(event, action);
  }
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
      event.preventDefault();
      actions.forEach((action) => action);
    }
  });
};
// const switchDisplay = (element) =>{
//   element.style.display = element.style.display === 'none' ? '' : 'none';
// };
const switchDisplay = (element) => {
  element.classList.toggle("hidden");
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
// window.onload = () => {
//   projectPanelStarter.initialize();
// };
// ===========START=========================
const projectPanel = projectPanelStarter.initialize();

// addProjectBtn.addEventListener('click',()=>{
//   switchDisplay(addProjectQuery);
// })
// ----- OPEN DIALOG------
addAction(addProjectBtn, () => switchDisplay(addProjectQuery));

addAction(addProjectQuery, () =>
  submitEnter(
    projectTitleInput,
    () => projectPanel.projectManager.addProject(),
    () => makeTab(projectTitleInput.value, projectList)
  )
);

// projectPanel.projectManager.addProject("Diuna");
console.log(`project title is ${projectPanel.projects[0]["title"]}`);
//add nex item in projects list

// project add ultra function
// -------------------CREATE NEW TAB FACTORY---------------
const makeTab = (title, container) => {
  
  class ProjectTab {  
    typeOfElement = "li";
    classes = "project-list-cell project-tab button";
    htmlContent = `<div class="project-cell-name-container">
                      <span class="project-cell-name">${title}</span>
                      <img src="" alt=" "  class="drop-arrow button" />
                    </div>
                    <div class="progress-bar-main-container">
                      <div class="progress-bar"></div>
                    </div>`;
    constructor(title) {
      this.title = title;
      
      this.newElement = document.createElement(this.typeOfElement);
      this.classList = this.classes;
      this.contentHTML = this.htmlContent;
    }
    add(title, container) {
      this.newElement.classList.add(this.classList);
      this.innerHTML = this.contentHTML;
      container.appendChild(newElement);
    }
  }

  const newTab= new ProjectTab((title));
  newTab.add(title,container);
};
