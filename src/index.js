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

import dropArrowSrc from "./assets/images/drop_down_arrow.webp";
const dropArrows = document.querySelectorAll(".drop-arrow");
dropArrows.forEach((dropArrow) => (dropArrow.src = dropArrowSrc));

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
  addProject(title) {
    const project = new Project(title);
    this.projects.push(project);
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
