import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator } = validateInput();

export class TaskBar {
  constructor(task) {
    this.title = task.title;
    this.startDate = TaskBar.formatDate(task.startDate);
    this.endDate = TaskBar.formatDate(task.endDate);
    this.priority = task.priority;
    this.projectAssigned = task.projectAssigned;
    this.isComplete = task.isComplete;
    this.description = task.description;
    this.id = this.title.split(" ").join("-").toLowerCase();
  }
  static formatDate(date) {
    const dateParts = date.split("-");
    // Rearrange to 'dd-MM-yyyy' format
    const reformattedDate =
      dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    console.log("Reformatted date is:", reformattedDate);
    return reformattedDate;
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

  addTaskBar() {
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
    newElement.setAttribute('data-project-assigned', taskBar.projectAssigned);
    TaskBarManager.classes.forEach((className) => {
      newElement.classList.add(className);
    });
    // adding background depends on priority
    TaskBarManager.addTaskBarPriority(newElement, taskBar);
    //listeners
    this.addControlPanelListeners(taskBar, newElement);

    newElement.setAttribute("id", id);
    this.container.appendChild(newElement);
  }

  loadElementsFromStorage(container, activeTab) {
    console.log("taskbar list length is", this.taskBarsList.length);
    container.innerHTML = "";
    const today = new Date();
    const formattedCurrentDate = format(today, "dd-MM-yyyy");
    console.log("New date in loadElementFromStorage is ", formattedCurrentDate);
    this.taskBarsList.forEach((taskBar) => {
      console.log(
        `taskBar endDate = ${taskBar.endDate}and today is ${formattedCurrentDate}`
      );
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
        newElement.setAttribute('data-project-assigned', taskBar.projectAssigned);
        //listeners for control panel
        const doneBtn = newElement.querySelector(".done");
        console.log("Task bar in load elements is :", taskBar.isComplete);
        if (taskBar.isComplete) {
          doneBtn.classList.add("marked");
          console.log("Task bar marked as complete during loading");
        } else {
          console.log("Loaded task isn't marked as complete.");
        }

        this.addControlPanelListeners(taskBar, newElement);

        container.appendChild(newElement);
      } else if (
        taskBar.endDate === formattedCurrentDate &&
        activeTab.id === "today"
      ) {
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
        newElement.setAttribute('data-project-assigned', taskBar.projectAssigned);
        //listeners for control panel
        const doneBtn = newElement.querySelector(".done");
        const editBtn = newElement.querySelector(".edit");
        const deleteBtn = newElement.querySelector(".delete-button");
        console.log("Task bar in load elements is :", taskBar.isComplete);
        doneBtn.classList.add("disable");
        editBtn.classList.add("disable");
        deleteBtn.classList.add("disable");

        if (taskBar.isComplete) {
          doneBtn.classList.add("marked");
        } else {
          console.log("Loaded task isn't marked as complete.");
        }

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
      descriptionBtn.classList.toggle("clicked");
    });
    editBtn.addEventListener("click", () => {
      console.log("EditBtn  clicked");
      // addOrEditFlag = 1;
      // let activeTaskBar = e.target.closest(".task-item");
      editBtn.classList.toggle("clicked");
      editTaskForm.classList.toggle("for-edit");
      //delay to let the task bar get active
      setTimeout(() => {
        addTaskBtn.click();
      }, 100);

      //editTaskForm.classList.toggle("hidden");
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
  removeTaskBar(id) {
    const index = this.taskBarsList.findIndex((taskBar) => taskBar.id === id);
    if (index !== -1) {
      this.taskBarsList.splice(index, 1);

      this.saveTaskBarsToStorage();
    }
  }
  isComplete(id) {
    const index = this.taskBarsList.findIndex((taskBar) => taskBar.id === id);
    const editedTask = this.taskManager.getLastModifiedTask();
    if (index !== -1) {
      this.taskBarsList[index].isComplete = editedTask.isComplete;

      this.saveTaskBarsToStorage();
    } else {
      console.log(" Cannot mark complete ");
    }
  }
}
