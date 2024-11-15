import LocalStorageManager from "./storage";

export class Project {
  constructor(title) {
    this.title = title;
    this.tasks = ["task1", "task2"]; //testing
    this.progress = 0;
    this.id = title.split(" ").join("-").toLowerCase();
    // this.localStorageManager = new LocalStorageManager();
    // this.tasksStorage = this.setNewTasksArrayToLocalStorage(this.id, this.tasks);
    // this.taskManager = new TaskManager(this.id, this.tasksStorage);
  }
  // setNewTasksArrayToLocalStorage(id, tasksArray) {

  // this.localStorageManager.update(id,tasksArray);
  // return this.localStorageManager.read(id);
  // }
  // show(){
  //   console.log("task storage is", this.tasksStorage)
  // }
}
export class ProjectManager {
  constructor(projectsKey, validator) {
    this.localStorageManager = new LocalStorageManager();
    this.projectsKey = projectsKey;
    this.projects = this.loadProjectsFromStorage() || [];
    this.validator = validator;
    this.indexOfLastModified = null; //helps with returning last modified project
  }
  static checkInput(validator, projects, input) {
    const isEmpty = validator.isEmpty(input);
    const isUnique = validator.isUnique(projects, input);

    return { isEmpty, isUnique };
  }

  loadProjectsFromStorage() {
    return this.localStorageManager.read(this.projectsKey);
  }

  saveProjectsToStorage() {
    this.localStorageManager.update(this.projectsKey, this.projects);
  }

  getLastModifiedProject() {
    return this.projects[this.indexOfLastModified];
  }
  addProject(input) {
    const { isEmpty, isUnique } = ProjectManager.checkInput(
      this.validator,
      this.projects,
      input
    );
    if (isEmpty && isUnique) {
      const project = new Project(input.value);
      console.log(`addProject project title is: ${project.title}`);
      this.projects.push(project);
      this.saveProjectsToStorage();
      // this.projects[0].show();
      console.log(`Project added: ${this.projects[0].title}`);
      return project;
    } else {
      if (!isEmpty) {
        alert("Project title cannot be empty!");
        return null;
      } else if (!isUnique) {
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
  renameProject(id, input) {
    this.indexOfLastModified = null;
    const index = this.projects.findIndex((project) => project.id === id);

    const { isEmpty, isUnique } = ProjectManager.checkInput(
      this.validator,
      this.projects,
      input
    );
    if (isEmpty && isUnique) {
      this.projects[index].title = input.value;
      this.projects[index].id = input.value.split(" ").join("-").toLowerCase();
      this.indexOfLastModified = index;
      this.saveProjectsToStorage();
      console.log(
        "Index of lat modified project is: ",
        this.indexOfLastModified
      );
    } else {
      if (!isEmpty) {
        alert("Project title cannot be empty!");
        return null;
      } else if (!isUnique) {
        alert("Project title already exists!");
        return null;
      }
      console.warn("Project validation failed.");
      return null;
    }
  }
  removeProject(id) {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.saveProjectsToStorage();
      console.log("removed project id:", id);
      return true;
    } else {
      console.warn(" couldn't remove project", id);
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

export class Task {
  constructor({
    title,
    startDate= "17-10-2024",
    endDate = "17-10-2024",
    priority = "low",
    projectAssigned = "default",
    isComplete = false,
    description = "",
  } = {}) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.projectAssigned = projectAssigned;
    this.isComplete = isComplete;
    this.description = description;
    this.id = this.title.split(" ").join("-").toLowerCase();
  }
}

export class TaskManager {
  constructor(projectsKey) {
    this.localStorageManager = new LocalStorageManager();
    this.projectsKey = projectsKey;
    this.projects = this.loadProjectsFromStorage() || [];
  }
  loadProjectsFromStorage() {
    return this.localStorageManager.read(this.projectsKey);
  }
  saveProjectsToStorage() {
    return this.localStorageManager.update(this.projectsKey, this.projects);
  }
  getProject(projectId) {
    const index = this.projects.findIndex(
      (project) => project.id === projectId
    );
    if (index !== -1) {
      return this.projects[index];
    }
  }
  getProjectTasks(projectId) {
    return this.getProject(projectId).tasks;
  }

  addTask({
    title,
    startDate = "17-10-2024",
    endDate = "18-10-2024",
    priority = "low",
    projectAssigned = "default",
    isComplete = false,
    description = "",
  }) {
    const task = new Task({
      title,
      startDate,
      endDate,
      priority,
      projectAssigned,
      isComplete,
      description,
    });
    //check projectAssigned from activeTab
    //this.getProjectTasks(activeTab.id).push(task)
    const project = this.getProject(task.projectAssigned);
    project.tasks.push(task);
    this.saveProjectsToStorage();
  }
  removeTask(title) {
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
