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
  static checkInput(validator, projects, input) {
    const isEmpty = validator.isEmpty(input);
    const isUnique = validator.isUnique(projects, input);
    
    return {isEmpty, isUnique}
  }
  addProject(input) {
    const {isEmpty, isUnique} = ProjectManager.checkInput(inputUniqueValidator, this.projects, input);
    if (isEmpty && isUnique) {
      const project = new Project(input.value);
      console.log(`addProject project title is: ${project.title}`);
      this.projects.push(project);
      console.log(`Project added: ${this.projects[0].title}`);
      return project;
    } else {
      if (!isEmpty) {
        alert("Project title cannot be empty!");
        return null;
      }
      else if (!isUnique) {
        alert("Project title already exists!");
        return null;
        
      }
      console.warn("Project validation failed.");
      return null;
      
      
    }
    
  }
  getLastProject() {
    return this.projects[this.projects.length - 1];
  }
  removeProject(title) {
    const index = this.projects.findIndex((project) => project.title === title);
    if (index !== -1) {
      this.projects.splice(index, 1);
      console.log("removed project name:", title);
      return true;
    } else {
      console.warn("ProjectPanel couldn't remove project", title);
      return false;
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
          break;  // Stop executing further actions if `null` is returned
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
})();
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
const projectPanel = projectPanelStarter.initialize();
const dropDown = document.getElementById("edit-project-2");
const arrows = document.querySelectorAll(".drop-arrow");
const tabs = document.querySelectorAll(".project-tab");

const addProjectBtn = document.querySelector("#add-project");
const addProjectQuery = document.querySelector("#add-project-query");
const projectTitleInput = document.querySelector("#project-title-input");
const projectList = document.querySelector("#project-list");
console.log("tabs array is", projectList.children);

// arrow.addEventListener("click", () => {
//   dropDown.classList.toggle("visible");
// });

// ----- OPEN DIALOG------
addListener(addProjectBtn, "click", () =>
  cleanerAndSwitcher(addProjectQuery, projectTitleInput)
);

submitEnter(
  projectTitleInput,
  () => projectPanel.projectManager.addProject(projectTitleInput),

  () =>
    makeTab(projectPanel.projectManager.getLastProject(), projectList),
  () => {
    const cleaner = new TextInputCleaner();
    cleaner.clean(projectTitleInput);
  },
  () => addProjectQuery.classList.toggle("hidden")
);

//remove active-tab class from other tabs than clicked one

addParentListenerNearest("click", ".project-tab", projectList, (e, target) => {
  //remove active-tab from other tabs

  removeClass(tabs, "active-tab");
  target.classList.add("active-tab");
});
// add listeners to all tab list drop arrows
// addParentListener("click", ".drop-down-content", arrow,(e,target)=>{
//   target.classList.toggle("visible");
// })
arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    console.log("arrow toggled");
    dropDown.classList.toggle("visible");
  });
});

// -------------------CREATE NEW TAB FACTORY---------------
const makeTab = (project, container) => {
  if(project){

  const title = project.title;
  class ProjectTab {
    static typeOfElement = "li";
    static classes = ["project-list-cell", "project-tab", "button"];
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
    }
  }

  if (title) {
    const newTab = new ProjectTab(title);
    // newTab.toggleActiveTab(container, activeTabClass);
    newTab.addTab(container);
  } else {
    console.warn("Cannot create new tab- title input is empty");
  }
}
else{
  "cannot make tab- input error"
}
};
