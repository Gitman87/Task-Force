import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator } = validateInput();

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

    this.id = this.title.split(" ").join("-").toLowerCase();
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
  getActiveProjectId() {
    const activeTab = document.querySelector(".active-tab");
    console.log("Active tab id is :", activeTab.id);
    return activeTab.id;
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
    return this.tasks[this.indexOfLastModified];
  }
  getLastTask() {
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
      console.log(`Pushed task to ${project.id} is ${project.tasks[project.tasks.length-1].id} and length of tasks array is ${project.tasks.length}`)
      this.saveProjectsToStorage();
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
  removeTask(title) {
    updateProjectsProjectTasks()
    
    const index = this.tasks.findIndex((task) => task.title === title);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveProjectsToStorage();
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
  static classes = ["task-item"];
  static activeTaskBar = "active-task";
  static getHtmlContent(title, endDate) {
    return `<li class = "task-item">
                  <div class="task-bar-container">
                      <div class="task-bar-bckg">
                        <div class="task-bar">
                          <div class="task-bar-content">
                            <div class="task-bar-name">${title}</div>
                            <div class="task-bar-time">
                              <p class="time-stamp">${endDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul class="task-item-control">
                      <li class="description button push-button"></li>
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
  }
  removeTaskBars(projectId){
     const newList = this.taskBarsList.filter(item => item.projectAssigned != projectId);
     this.taskBarsList = newList;
     this.saveTaskBarsToStorage();
     
     console.log("taskbar list length is", this.taskBarsList.length)

  }
  addTaskBar(container) {
    const lastTask = this.taskManager.getLastTask();
    const newTaskBar = new TaskBar(lastTask);
    const title = newTaskBar.title;
    const id = newTaskBar.id;
    console.log("Id of new taskbar is ", id);
    const endDate = newTaskBar.endDate;
    this.taskBarsList.push(newTaskBar);
    this.saveTaskBarsToStorage();
    const newElement = document.createElement(TaskBarManager.typeOfElement);
    newElement.innerHTML = TaskBarManager.getHtmlContent(title, endDate);

    TaskBarManager.classes.forEach((className) => {
      newElement.classList.add(className);
    });
    newElement.setAttribute("id", id);
    container.appendChild(newElement);
  }
  loadElementsFromStorage(container, activeTab) {
    console.log("taskbar list length is", this.taskBarsList.length);
    this.taskBarsList .forEach((taskBar) => {
      //only if taskBar's projectAssigned is matching active tab's id
      if(taskBar.projectAssigned === activeTab.id){
        const newElement = document.createElement(TaskBarManager.typeOfElement);
      newElement.innerHTML = TaskBarManager.getHtmlContent(
        taskBar.title,
        taskBar.endDate
      );
      TaskBarManager.classes.forEach((className) => {
        newElement.classList.add(className);
      });
      newElement.setAttribute("id", taskBar.id);
      container.appendChild(newElement);

      }
      else{
        console.log("No task bars to load");
      }

      
    });
  }
  reassignTaskBars(oldProjectId, newProjectId){
    if(this.taskBarsList[0]){

      this.taskBarsList.forEach(element => {
        if(element.projectAssigned === oldProjectId){
          element.projectAssigned = newProjectId;
        }
      });
      this.saveTaskBarsToStorage();
    }
    else {
      console.log("Cannot reassign any taskBar")
    }
  }
  removeAllTasksBars(container){
    container.innerHTML="";

  }
}