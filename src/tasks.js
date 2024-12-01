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
    projectAssigned = "default",
    description
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
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "default";
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
      console.log("Loaded projects to taskManager are:", projects);
      return projects;
    }
  }
  saveProjectsToStorage() {
    return this.localStorageManager.update(this.projectsKey, this.projects);
  }
  loadTasksFromStorage(id) {
    // const projects = this.loadProjectsFromStorage() || [];
    const project = this.projects.find((project) => project.id === id);
    console.log("founded project to load tasks from is ", project.id);
    const tasks = project.tasks;
    return tasks;
  }

  getProject(projectId) {
    const project = this.projects.find((project) => project.id === projectId);
    if (!project) {
      console.warn(`Project with ID "${projectId}" not found.`);
      return null;
    }
    return project;
  }
  getProjectTasks(projectId) {
    const project = this.getProject(projectId);
    console.log("project in getProjectTasks is: ", project);
    return project.tasks;
  }
  // getTaskFromProject(projectId, taskId) {
  //   const tasks = this.getProjectTasks(this.getActiveProjectId(".active-tab"));
  //   console.log("tasks got prom project are ", tasks);
  //   const index = tasks.findIndex((task) => task.id === task.id);
  //   return tasks[index];
  // }
  getActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    console.log("getActiveProjectId is :", activeTab.id);
    return activeTab.id;
  }
  saveActiveProjectId() {
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "default";
  }
  updateActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    this.activeProjectId = activeTab ? activeTab.id : "default"; // Validate here
  }
  updateProjectTasks() {
    console.log("Active project ID:", this.activeProjectId);
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
    // const projects = this.localStorageManager.read(this.projectsKey);
    // const project = projects.find(activeTab.id);
    // const tasks = project.tasks;
    // const taskId= activeTask.id;
    const index = this.tasks.findIndex((task) => task.id === activeTask.id);
    console.log("  get task this task is  ", this.tasks[index]);
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

      console.log(
        `Pushed task to ${project.id} is ${
          project.tasks[project.tasks.length - 1].id
        } and length of tasks array is ${project.tasks.length}`
      );
      this.saveProjectsToStorage();
      this.updateProjectsProjectTasks();
      return 1;
      // console.log(
      //   `Tasks array of project ${project.title} is ${project.tasks[3].priority}`
      // );
    } else {
      if (!isEmpty) {
        alert("task title cannot be empty!");
        return null;
      } else if (!isUnique) {
        alert("Task title already exists!");
        return null;
      }
      console.warn("Task validation failed.");
      return null;
    }

    //check projectAssigned from activeTab
    //this.getProjectTasks(activeTab.id).push(task)
  }
  editTask(activeTaskBar, title, startDate, endDate, priority, description) {
    //consider putting this to task manger and leave updating task bar looks for this manager
    // this.updateProjectsProjectTasks();
    // const taskIndex = this.this.getLastModifiedTask();
    // console.log("taskIndex is ", taskIndex);

    const taskIndex = this.getTaskIndex(activeTaskBar);
    console.log("edit task taskIndex is ", taskIndex);
    const oldTask = this.getTask(activeTaskBar);
    console.log("old task before modification id is ", oldTask.id);
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
      console.log("Index of last modified task is ", this.indexOfLastModified);
      // activeTaskBar.id = newTask.id;
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
      console.warn("Task validation failed.");
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
  isComplete(activeTask, trueOrFalse){
    // console.log("activeTask in isCompleter is: ", activeTask);
    this.updateProjectsProjectTasks();
    const index = this.tasks.findIndex((task) => task.id === activeTask.id);
    console.log("Get task  in this.tasks[index] ", this.tasks[index]);
    this.tasks[index].isComplete = trueOrFalse;
    this.indexOfLastModified = index;
    this.saveProjectsToStorage();
  
  }
  // getTask(id) {
  //   this.updateProjectsProjectTasks();

  //   if (!Array.isArray(this.tasks)) {
  //       console.warn("Tasks array is not initialized or is invalid.");
  //       return null;
  //   }

  //   const index = this.tasks.findIndex((task) => task.id === id);

  //   if (index !== -1) {
  //       return this.tasks[index];
  //   } else {
  //       console.warn(`Task with ID "${id}" not found.`);
  //       return null;
  //   }
  // }
  getTasks() {
    return this.tasks;
  }
  sortTasks(strategy) {
    strategy.sort(this.tasks);
  }
  calculateProgress() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.isComplete).length;
    const number =totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    console.log("Calculated number of progress is: ")
    return  number;
  }
}
