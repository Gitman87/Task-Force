export class ProjectPanel {
  constructor(validator) {
    this.projects = [];
    this.projectManager = new ProjectManager(this.projects, validator);
    
  }
  initialized() {
    console.log("Project Panel initialized!");
  } // check if created
}
export class Project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.progress = 0;
    this.taskManager = new TaskManager(this.tasks);
    this.id = title.split(" ").join("-").toLowerCase();
  }
}
export class ProjectManager {
  constructor(projects, validator) {
    this.projects = projects;
    this.validator = validator;
  }
  static checkInput(validator, projects, input) {
    const isEmpty = validator.isEmpty(input);
    const isUnique = validator.isUnique(projects, input);

    return { isEmpty, isUnique };
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
  renameProject(id, input){
    const index = this.projects.findIndex((project) => project.id === id);
    
    const {isEmpty, isUnique} =ProjectManager.checkInput(this.validator, this.projects, input);
    if(isEmpty && isUnique){
      this.projects[index].title = input.value;
      this.projects[index].id = input.value.split(" ").join("-").toLowerCase();
    }

    else{
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
      console.log("removed project id:", id);
      return true;
    } else {
      console.warn("ProjectPanel couldn't remove project", id);
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

export class TaskManager {
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