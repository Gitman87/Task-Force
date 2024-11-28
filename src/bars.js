import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator } = validateInput();

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
    container.innerHTML = "";
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
    editBtn.addEventListener("click", (e) => {
      console.log("EditBtn  clicked");
      // addOrEditFlag = 1;
      // let activeTaskBar = e.target.closest(".task-item");
      editBtn.classList.toggle("clicked");
      editTaskForm.classList.toggle("for-edit");
      //delay to let the task bar get active
      setTimeout(() => {
        addTaskBtn.click();;
      }, 100);
      
      
      

      // editTaskForm.classList.toggle("hidden");
    });
  }
  indexOfActiveTaskBar() {
    const activeTaskBar = document.querySelector(".active-task-bar");
    const index = this.taskBarsList.findIndex(
      (taskBar) => taskBar.id === activeTaskBar.id
    );
    return index;
  }
  editTaskBar() {
    const editedTask = this.taskManager.getLastModifiedTask();
    console.log("Last edited task is ", editedTask);
    //consider putting this to task manger and leave updating task bar looks for this manager
    const newTaskBar = new TaskBar(editedTask);
    console.log(
      "Active task bar is ",
      this.taskBarsList[this.indexOfActiveTaskBar()]
    );
    this.taskBarsList[this.indexOfActiveTaskBar()] = newTaskBar;
    console.log("taskBarlist  is: ", this.taskBarsList);

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
