const addProjectBtn = document.querySelector("#add-project");
const addProjectDialog=document.querySelector("#add-project-dialog");
const projectTitleInput=document.querySelector("#project-title-input");

const  addAction = (selector, event = "click", action) => {
  const elements = document.querySelectorAll(selector);
  const eventString = event.toString();
  elements.forEach((element) => {
    element.addEventListener(eventString, () => action);
  });
}
const changeElementAttribute =  (element, attribute) =>{
  
  if(!element.hasAttribute(attribute)){
    element.setAttribute(attribute, attribute)
}
  else{
    element.removeAttribute(attribute)
  }
}




const submitEnter = (input) =>{
  input.addEventListener('keypress', (event)=>{
    if(event.key === "Enter"){
      event.preventDefault();
      return input.value;
    }
  })
}


// -----------LOCAL STORAGE---------
const serializeObject = (object) =>{
  return JSON.stringify(object);
}
const parseObject = (serializedObject) =>{
  return JSON.parse(serializedObject);
}
const recordToLocalStorage = (keyName, item) =>{
  localStorage.setItem(keyName, item);
}
const readFromLocalStorage = (keyName) => {
  return localStorage.getItem(keyName);
}


// -----SUBMIT NEW PROJECT FORM-------

// ----- OPEN DIALOG------
addAction(addProjectBtn, changeElementAttribute(addProjectDialog, "open"));

// SUBMIT





//if there is no project panel yt, create one onLoad


window.onload = ()=>{
  if(!projectPanel){
    const projectPanel = new ProjectPanel;
    projectPanel.initialize();
  }
  else{
    console.log("Project panel already exist!");
  }
}

// add listener for new project title
let projectTitle = submitEnter(projectTitleInput);
projectPanel.projectManager.addProject(projectTitle);
console.log(`project title is ${projectPanel.projects[0]['title']}`); 




