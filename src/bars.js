import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format, compareAsc } from "date-fns";
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

    const reformattedDate =
      dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

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
  }
  static addTaskBarPriority(element, newObject) {
    const taskBarBckg = element.querySelector(
      TaskBarManager.taskBarBckgSelector
    );

    if (newObject.priority === TaskBarManager.highClass) {
      taskBarBckg.classList.add(TaskBarManager.highClass);
    } else if (newObject.priority === TaskBarManager.mediumClass) {
      taskBarBckg.classList.add(TaskBarManager.mediumClass);
    }
  }

  addTaskBar() {
    const lastTask = this.taskManager.getLastTask();
    const taskBar = new TaskBar(lastTask);
    const title = taskBar.title;
    const id = taskBar.id;

    const endDate = taskBar.endDate;

    this.taskBarsList.push(taskBar);
    this.saveTaskBarsToStorage();
    const newElement = document.createElement(TaskBarManager.typeOfElement);
    newElement.innerHTML = TaskBarManager.getHtmlContent(title, endDate);
    newElement.setAttribute("data-project-assigned", taskBar.projectAssigned);
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
  convertToDate(dateString) {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  }
  sortDates() {
    const oldArray = this.taskBarsList;
    const newArray = oldArray.sort((a, b) => {
      const aDate = this.convertToDate(a.endDate);
      const bDate = this.convertToDate(b.endDate);
      return compareAsc(aDate, bDate);
    });

    return newArray;
  }
  loadElementsFromStorage(container, activeTab) {
    container.innerHTML = "";
    const today = new Date();
    const formattedCurrentDate = format(today, "dd-MM-yyyy");

    this.taskBarsList = this.sortDates();
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
        newElement.setAttribute(
          "data-project-assigned",
          taskBar.projectAssigned
        );
        //listeners for control panel
        const doneBtn = newElement.querySelector(".done");

        if (taskBar.isComplete) {
          doneBtn.classList.add("marked");
        }
        //check if expired
        if (compareAsc(taskBar.endDate, formattedCurrentDate) == -1) {
          newElement.classList.add("expired");
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
        newElement.setAttribute(
          "data-project-assigned",
          taskBar.projectAssigned
        );
        //listeners for control panel
        const doneBtn = newElement.querySelector(".done");
        const editBtn = newElement.querySelector(".edit");
        const deleteBtn = newElement.querySelector(".delete-button");

        doneBtn.classList.add("disable");
        editBtn.classList.add("disable");
        deleteBtn.classList.add("disable");

        if (taskBar.isComplete) {
          doneBtn.classList.add("marked");
        }

        this.addControlPanelListeners(taskBar, newElement);

        container.appendChild(newElement);
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
      editBtn.classList.toggle("clicked");
      editTaskForm.classList.toggle("for-edit");

      setTimeout(() => {
        addTaskBtn.click();
      }, 100);
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

    const newTaskBar = new TaskBar(editedTask);

    this.taskBarsList[this.indexOfActiveTaskBar()] = newTaskBar;

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
    }
  }
  countIncomplete() {
    let number = 0;
    this.taskBarsList.forEach((taskBar) => {
      if (!taskBar.isComplete) {
        number++;
      }
    });

    return number;
  }
}
