import LocalStorageManager from "./storage";
import { validateInput } from "./validation";
import { format } from "date-fns";
const { inputValidator, inputUniqueValidator, inputUniqueForOthersValidator } =
  validateInput();

export class Project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.progress = 0;
    this.id = title.split(" ").join("-").toLowerCase();
    
  }

}
export class ProjectManager {
  constructor(projectsKey) {
    this.localStorageManager = new LocalStorageManager();
    this.projectsKey = projectsKey;
    this.projects = this.loadProjectsFromStorage() || [];
    this.validator = inputUniqueValidator;
    this.indexOfLastModified = null; //helps with returning last modified project
  }
  static checkInput(validator, projects, input) {
    const isEmpty = validator.isEmpty(input);
    const isUnique = validator.isUnique(projects, input);

    return { isEmpty, isUnique };
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
    this.localStorageManager.update(this.projectsKey, this.projects);
  }

  getLastModifiedProject() {
    return this.projects[this.indexOfLastModified];
  }
  updateProjects() {
    this.projects = this.loadProjectsFromStorage() || [];
  }
  addProject(input) {
    const { isEmpty, isUnique } = ProjectManager.checkInput(
      this.validator,
      this.projects,
      input
    );
    if (isEmpty && isUnique) {
      this.updateProjects();
      const project = new Project(input.value);
      
      this.projects.push(project);
      this.saveProjectsToStorage();
      
      return project;
    } else {
      if (!isEmpty) {
        alert("Project title cannot be empty!");
        return null;
      } else if (!isUnique) {
        alert("Project title already exists!");
        return null;
      }
     
      return null;
    }
  }
  getLastProject() {
    return this.projects[this.projects.length - 1];
  }
  renameProject(id, input) {
    this.indexOfLastModified = null;
    this.updateProjects();

    const index = this.projects.findIndex((project) => project.id === id);

    const { isEmpty, isUnique } = ProjectManager.checkInput(
      this.validator,
      this.projects,
      input
    );
    if (isEmpty && isUnique) {
      this.projects[index].title = input.value;
      this.projects[index].id = input.value.split(" ").join("-").toLowerCase();

      if (this.projects[index].tasks[0]) {
        this.projects[index].tasks.forEach((element) => {
          element.projectAssigned = this.projects[index].id;
        });
      } else {
        
      }

      this.indexOfLastModified = index;
      this.saveProjectsToStorage();
    } else {
      if (!isEmpty) {
        alert("Project title cannot be empty!");
        return null;
      } else if (!isUnique) {
        alert("Project title already exists!");
        return null;
      }
      
      return null;
    }
  }
  removeProject(id, taskBarsContainer) {
    this.updateProjects();
    const index = this.projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.saveProjectsToStorage();
      this.updateProjects();
      taskBarsContainer.innerHTML = " ";
      
      return true;
    } else {
      
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
  getProjectById(id) {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      return this.projects[index];
    }
  }
  changeProgress(id, number) {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      this.projects[index].progress = number;
     
    } else {
      console.warn("Couldn't change progress property of the project");
    }
  }

  sortProjects(strategy) {
    strategy.sort(this.projects);
  }
}
