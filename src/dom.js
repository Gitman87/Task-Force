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
const changeElementAttribute =  (element, attribute)=>{
  
  if(!element.hasAttribute(attribute)){
    element.setAttribute(attribute, attribute)
}
  else{
    element.removeAttribute(attribute)
  }
}


addAction(addProjectBtn, changeElementAttribute(addProjectDialog, "open"));

const submitEnter = (input)=>{
  input.addEventListener('keypress', (event)=>{
    if(event.key === "Enter"){
      event.preventDefault();
      return input.value;
    }
  })


}



// const showWindow = 
// adding new project

// const projectPanel = new ProjectPanel;

// const openCloseDialog = (element)=>{
//   if (!element.hasAttribute('open')) {
//     element.setAttribute('open', 'open');
//   }
//   else{
//     element.removeAttribute('open');
//   }
// }


//open dialog box with form to add project

