import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator, inputIsUniqueForOthers } =
  validateInput();
import { cleanerAndSwitcher } from "./index.js";

export class Task {
  constructor({
    title,
    startDate,
    endDate,
    priority = "low",
    projectAssigned,
    description,
  } = {}) {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
    this.title = title.value;
    this.startDate = startDate || formattedCurrentDate;
    this.endDate = endDate || formattedCurrentDate;
    this.priority = priority;
    this.projectAssigned = projectAssigned;
    this.isComplete = false;
    this.description = description || "";
    this.id = title.value.split(" ").join("-").toLowerCase();
  }
}

export class TaskManager {
  constructor(projectsKey) {
    this.localStorageManager = new LocalStorageManager();
    this.projectsKey = projectsKey;
    this.projects = this.loadProjectsFromStorage() || [];
    this.validator = inputUniqueValidator;
    this.inputIsUniqueForOthers = inputIsUniqueForOthers;
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "today";
    this.tasks = this.loadTasksFromStorage(this.activeProjectId);
    this.indexOfLastModified = null;
    this.idOfLastModified = "";
  }
  loadProjectsFromStorage() {
    const projects = this.localStorageManager.read(this.projectsKey);
    if (!projects) {
      console.warn(
        "Couldn't load projects in loadProjectsFromStorage of taskManger"
      );
    } else {
      return projects;
    }
  }
  saveProjectsToStorage() {
    return this.localStorageManager.update(this.projectsKey, this.projects);
  }
  loadTasksFromStorage(id) {
    const project = this.projects.find((project) => project.id === id);

    const tasks = project.tasks;
    return tasks;
  }

  getProject(projectId) {
    const project = this.projects.find((project) => project.id === projectId);
    if (!project) {
      return null;
    }
    return project;
  }
  getProjectTasks(projectId) {
    const project = this.getProject(projectId);

    return project.tasks;
  }

  getActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    if (activeTab) {
      return activeTab.id;
    } else {
      return null;
    }
  }
  saveActiveProjectId() {
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "today";
  }
  updateActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    this.activeProjectId = activeTab ? activeTab.id : "today"; // Validate here
  }
  updateProjectTasks() {
    this.tasks = this.loadTasksFromStorage(this.activeProjectId);
  }
  getLastModifiedTask() {
    this.updateProjectsProjectTasks();
    return this.tasks[this.indexOfLastModified];
  }
  getTaskIndex(activeTask) {
    const index = this.tasks.findIndex((task) => task.id === activeTask.id);
    return index;
  }
  getTask(activeTask) {
    this.updateProjectsProjectTasks();
    const index = this.tasks.findIndex((task) => task.id === activeTask.id);

    return this.tasks[index];
  }
  getLastTask() {
    this.updateProjectsProjectTasks();
    return this.tasks[this.tasks.length - 1];
  }
  updateProjectsProjectTasks() {
    this.updateProjects();
    this.updateActiveProjectId();
    this.updateProjectTasks();
  }
  updateProjects() {
    this.projects = this.loadProjectsFromStorage() || [];
  }
  checkInput(input) {
    const isEmpty = this.validator.isEmpty(input);
    const isUnique = this.validator.isUnique(this.tasks, input);

    return { isEmpty, isUnique };
  }
  checkInputForOthers(input, array, index) {
    const isEmpty = this.validator.isEmpty(input);
    const isUniqueForOthers = this.inputIsUniqueForOthers.isUniqueForOthers(
      input,
      array,
      index
    );

    return { isEmpty, isUniqueForOthers };
  }

  addTask({
    title,
    startDate,
    endDate,
    priority,
    projectAssigned,
    description,
  }) {
    //some validation?
    this.updateProjectsProjectTasks();
    const project = this.getProject(this.activeProjectId);
    if (!project) {
      console.error(
        `Cannot add task. Project with ID "${this.activeProjectId}" not found.`
      );
      return null;
    }
    const { isEmpty, isUnique } = this.checkInput(title);
    if (isEmpty && isUnique) {
      const task = new Task({
        title,
        startDate,
        endDate,
        priority,
        projectAssigned,
        description,
      });
      const project = this.getProject(task.projectAssigned);
      project.tasks.push(task);
      this.saveActiveProjectId();

      this.saveProjectsToStorage();
      this.updateProjectsProjectTasks();
      return 1;
    } else {
      if (!isEmpty) {
        alert("task title cannot be empty!");
        return null;
      } else if (!isUnique) {
        alert("Task title already exists!");
        return null;
      }

      return null;
    }
  }
  editTask(activeTaskBar, title, startDate, endDate, priority, description) {
    const taskIndex = this.getTaskIndex(activeTaskBar);

    const oldTask = this.getTask(activeTaskBar);

    const { isEmpty, isUniqueForOthers } = this.checkInputForOthers(
      title,
      this.tasks,
      taskIndex
    );
    if (isEmpty && isUniqueForOthers) {
      const currentDate = new Date();
      const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
      oldTask.title = title.value;
      oldTask.startDate = startDate || formattedCurrentDate;
      oldTask.endDate = endDate || formattedCurrentDate;
      oldTask.priority = priority;
      oldTask.description = description;
      oldTask.id = title.value.split(" ").join("-").toLowerCase();
      const newTask = oldTask;
      tasks[taskIndex] = newTask;
      this.indexOfLastModified = taskIndex;

      this.saveProjectsToStorage();
      this.updateProjectsProjectTasks();
      return 1;
    } else {
      if (!isEmpty) {
        alert("task title cannot be empty!");
        return null;
      } else if (!isUniqueForOthers) {
        alert("Task title already exists!");
        return null;
      }

      return null;
    }
  }
  removeTask(id) {
    this.updateProjectsProjectTasks();
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveProjectsToStorage();
    }
  }
  isComplete(activeTask, trueOrFalse) {
    this.updateProjectsProjectTasks();
    const index = this.tasks.findIndex((task) => task.id === activeTask.id);

    this.tasks[index].isComplete = trueOrFalse;
    this.indexOfLastModified = index;
    this.saveProjectsToStorage();
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
    const number = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return number;
  }
  countIncomplete() {
    let number = 0;
    this.tasks.forEach((task) => {
      if (!task.isComplete) {
        number++;
      }
    });

    return number;
  }
}
