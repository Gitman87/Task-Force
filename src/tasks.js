import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator } = validateInput();
import { cleanerAndSwitcher } from "./index.js";

export class Task {
  constructor({
    title,
    startDate,
    endDate,
    priority = "low",
    projectAssigned = "default",

    description = "",
  } = {}) {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
    this.title = title.value;
    this.startDate = startDate || formattedCurrentDate;
    this.endDate = endDate || formattedCurrentDate;
    this.priority = priority;
    this.projectAssigned = projectAssigned;
    this.isComplete = false;
    this.description = description;

    this.id = title.value.split(" ").join("-").toLowerCase();
  }
}

export class TaskManager {
  constructor(projectsKey) {
    this.localStorageManager = new LocalStorageManager();
    this.projectsKey = projectsKey;
    this.projects = this.loadProjectsFromStorage() || [];
    this.validator = inputUniqueValidator;
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "default";
    this.tasks = this.getProjectTasks(this.activeProjectId);
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
  getTaskFromProject(projectId, taskId){
    const tasks = this.getProjectTasks(this.getActiveProjectId(".active-tab"));
    console.log("tasks got prom project are ", tasks);
    const index = tasks.findIndex((task) => task.id === task.id);
    return tasks[index];

  }
  getActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    console.log("Active tab id is :", activeTab.id);
    return activeTab.id;
  }
  saveActiveProjectId(){
    this.activeProjectId = this.getActiveProjectId(".active-tab") || "default";
  }
  updateActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    this.activeProjectId = activeTab ? activeTab.id : "default"; // Validate here
  }
  updateProjectTasks() {
    console.log("Active project ID:", this.activeProjectId);
    this.tasks = this.getProjectTasks(this.activeProjectId);
  }
  getLastModifiedTask() {
    this.updateProjectsProjectTasks();
    return this.tasks[this.indexOfLastModified];
  }
  getTask(activeTab, activeTask){
    const projects = this.localStorageManager.read(this.projectsKey);
    const project = projects.find(activeTab.id);
    const tasks = project.tasks;
    const taskId = activeTask.id;
    const index = tasks.indexOf((task)=> task.id === taskId);
    return tasks[index];

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
    this.updateProjectsProjectTasks();
    const taskIndex = this.tasks.indexOf(activeTaskBar.id);
    const oldTask = this.getTask(activeTaskBar.id);
    console.log("old task before modification id is ", oldTask.id);
    oldTask.title = title.value;
    oldTask.startDate = startDate;
    oldTask.endDate = endDate;
    oldTask.priority = priority;
    oldTask.description = description;
    oldTask.id = title.value.split(" ").join("-").toLowerCase();
    const newTask = oldTask;
    tasks[taskIndex] = newTask;
    this.indexOfLastModified = taskIndex;
    // activeTaskBar.id = newTask.id;
    this.saveProjectsToStorage();
  }
  removeTask(id) {
    updateProjectsProjectTasks();

    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveProjectsToStorage();
    }
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
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }
}
// ------------------task bars-----------------
export class TaskBar {
  constructor(task) {
    this.title = task.title;
    this.startDate = task.startDate;
    this.endDate = task.endDate;
    this.priority = task.priority;
    this.projectAssigned = task.projectAssigned;
    this.description = task.description;
    this.id = this.title.split(" ").join("-").toLowerCase();
  }
}
export class TaskBarManager {
  static typeOfElement = "li";
  static classes = ["task-bar-item"];
  static highClass = "high";
  static mediumClass = "medium";
  static activeTaskBar = "active-task";
  static taskBarBckgSelector = ".task-bar-bckg";

  static getHtmlContent(title, endDate) {
    return `<li class = "task-item">
                  <div class="task-bar-container">
                      <div class="task-bar-bckg">
                        <div class="task-bar button">
                          <div class="task-bar-content">
                            <div class="task-bar-name">${title}</div>
                            <div class="task-bar-time">
                              <p class="time-stamp">${endDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="description-box">

                          
                      </div>
                           
                    </div>
                      <ul class="task-item-control">
                      <li class="description-btn button push-button"></li>
                      <li class="edit button push-button"></li>
                      <li class="delete-button button push-button"></li>
                      <li class="done button push-button"></li>
                    </ul>
           </li>`;
  }
  constructor(taskBarsKey, taskManager, container) {
    this.taskBarsKey = taskBarsKey;
    this.localStorageManager = new LocalStorageManager();
    this.taskBarsList = this.loadTaskBarsFromStorage() || [];
    this.taskManager = taskManager;
    this.container = container;
  }
  loadTaskBarsFromStorage() {
    return this.localStorageManager.read(this.taskBarsKey);
  }
  saveTaskBarsToStorage() {
    return this.localStorageManager.update(this.taskBarsKey, this.taskBarsList);
  }
  getNewestProjects() {
    const newestProjects = this.taskManager.getProjects();
    return newestProjects;
  }
  removeTaskBars(projectId) {
    const newList = this.taskBarsList.filter(
      (item) => item.projectAssigned != projectId
    );
    this.taskBarsList = newList;
    this.saveTaskBarsToStorage();

    console.log("taskbar list length is", this.taskBarsList.length);
  }
  static addTaskBarPriority(element, newObject) {
    const taskBarBckg = element.querySelector(
      TaskBarManager.taskBarBckgSelector
    );
    console.log("element is ", taskBarBckg.classList);
    console.log("element proproty  is ", newObject.priority);
    if (newObject.priority === TaskBarManager.highClass) {
      taskBarBckg.classList.add(TaskBarManager.highClass);
    } else if (newObject.priority === TaskBarManager.mediumClass) {
      taskBarBckg.classList.add(TaskBarManager.mediumClass);
    } else {
      console.warn("couldn't add new task bar priority");
    }
  }
  // static addSelectShadow(element){

  // }

  addTaskBar(container) {
    const lastTask = this.taskManager.getLastTask();
    const taskBar = new TaskBar(lastTask);
    const title = taskBar.title;
    const id = taskBar.id;
    console.log("Id of new taskbar is ", id);
    const endDate = taskBar.endDate;
    this.taskBarsList.push(taskBar);
    this.saveTaskBarsToStorage();
    const newElement = document.createElement(TaskBarManager.typeOfElement);
    newElement.innerHTML = TaskBarManager.getHtmlContent(title, endDate);

    TaskBarManager.classes.forEach((className) => {
      newElement.classList.add(className);
    });
    // adding background depends on priority
    TaskBarManager.addTaskBarPriority(newElement, taskBar);
    //listeners
    this.addControlPanelListeners(taskBar, newElement);

    newElement.setAttribute("id", id);
    container.appendChild(newElement);
  }

  loadElementsFromStorage(container, activeTab) {
    console.log("taskbar list length is", this.taskBarsList.length);
    this.taskBarsList.forEach((taskBar) => {
      //only if taskBar's projectAssigned is matching active tab's id
      if (taskBar.projectAssigned === activeTab.id) {
        const newElement = document.createElement(TaskBarManager.typeOfElement);
        newElement.innerHTML = TaskBarManager.getHtmlContent(
          taskBar.title,
          taskBar.endDate
        );
        TaskBarManager.classes.forEach((className) => {
          newElement.classList.add(className);
        });
        TaskBarManager.addTaskBarPriority(newElement, taskBar);
        newElement.setAttribute("id", taskBar.id);
        //listeners for control panel
       
        this.addControlPanelListeners(taskBar, newElement);

        container.appendChild(newElement);
      } else {
        console.log("No task bars to load");
      }
    });
  }
  addControlPanelListeners(taskBar, newElement) {
    const descriptionBtn = newElement.querySelector(".description-btn");
    const descriptionBox = newElement.querySelector(".description-box");
    const editBtn = newElement.querySelector(".edit");
    const editTaskForm = document.querySelector(".new-task-container");
    const addTaskBtn = document.querySelector("#add-task-button");

    descriptionBtn.addEventListener("click", () => {
      descriptionBox.classList.toggle("visible");
      descriptionBox.innerText = taskBar.description;
    });
    editBtn.addEventListener("click", () => {
      console.log("EditBtn  clicked");
      // addOrEditFlag = 1;
      editBtn.classList.toggle("clicked");
      editTaskForm.classList.add("for-edit");
      addTaskBtn.click();
      // editTaskForm.classList.toggle("hidden");
    });
  }
  indexOfActiveTaskBar() {
    const activeTaskBar = document.querySelector(".active-task-bar");
    const index = this.taskBarsList.indexOf(activeTaskBar);
    return index;
  }
  editTaskBar() {
    const editedTask = this.taskManager.getLastModifiedTask();
    console.log("Last edited task is ", editedTask);
    //consider putting this to task manger and leave updating task bar looks for this manager
    const newTaskBar = new TaskBar(editedTask);
    this.taskBarsList[this.indexOfActiveTaskBar] = newTaskBar;

    this.saveTaskBarsToStorage();
  }
  reassignTaskBars(oldProjectId, newProjectId) {
    if (this.taskBarsList[0]) {
      this.taskBarsList.forEach((element) => {
        if (element.projectAssigned === oldProjectId) {
          element.projectAssigned = newProjectId;
        }
      });
      this.saveTaskBarsToStorage();
    } else {
      console.log("Cannot reassign any taskBar");
    }
  }
  removeAllTasksBars(container) {
    container.innerHTML = "";
  }
}
