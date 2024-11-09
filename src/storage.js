// -----------LOCAL STORAGE---------
const serializeObject = (object) => {
  return JSON.stringify(object);
};
const parseObject = (serializedObject) => {
  return JSON.parse(serializedObject);
};
const recordToLocalStorage = (keyName, item) => {
  localStorage.setItem(keyName, item);
};
const readFromLocalStorage = (keyName) => {
  return localStorage.getItem(keyName);
};
// ----------------draft-------------------

class LocalStorageManager{

  read(key){
    const dugUpObject = localStorage.getItem(key);
    if(dugUpObject){
      const confirmedObject = JSON.parse(dugUpObject);
      return confirmedObject;
    }
    else{
      console.warn("Couldn't find in local storage any object with key: ", key);
      return null;
    }
  }
  write(object, key){
    //check if already exist
    if(!localStorage.includes(key)){
    const stringifiedObject = localStorage.setItem(JSON.stringify(object));
    
    }
    else {
      const foundObject= localStorage.getItem(key);
      console.warn(`There is already an item in localStorage with the key ${key} which is  ${foundObject}`);
      return null;
    }
  }
  remove(key){
    const dugUpObject = localStorage.getItem(key);
    if(dugUpObject){
      localStorage.removeItem(key);
      }
    else{
      console.warn("Couldn't remove in local storage any object with key: ", key);
      return null;
    }


  }
}
const localStorageManager = new LocalStorageManager();
export default localStorageManager;