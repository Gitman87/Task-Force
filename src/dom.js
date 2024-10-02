const addProjectBtn = document.querySelector("#add-project");

const  addAction = (selector, event = "click", action) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.addEventListener(event, () => action);
  });
}
// const showWindow = 
// adding new project

const projectPanel = new ProjectPanel;

 addAction("#add-project", projectPanel.projectManager.addProject(title));