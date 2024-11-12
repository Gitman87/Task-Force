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

export default class LocalStorageManager {
  read(key) {
    const dugUpObject = localStorage.getItem(key);
    if (dugUpObject) {
      const confirmedObject = JSON.parse(dugUpObject);
      return confirmedObject;
    } else {
      console.warn("Couldn't find in local storage any object with key: ", key);
      return null;
    }
  }
  write(key, item) {
    //check if already exist
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      const foundObject = localStorage.getItem(key);
      console.warn(
        `There is already an item in localStorage with the key ${key} which is  ${foundObject}`
      );
      return null;
    }
  }
  remove(key) {
    
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    } else {
      console.warn(
        "Couldn't remove in local storage any object with key: ",
        key
      );
      return null;
    }
  }
  update(key, item) {
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(item));
      // localStorage.getItem(key) = JSON.stringify(item);
      console.log(`Object with the key ${key} has been updated`);
    } else {
      localStorage.setItem(key, JSON.stringify(item));
      console.log(`Object with the key ${key} has been written down. `);
    }
  }
}
