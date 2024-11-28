
export const validateInput = () => {
  
  function addMethod(object, method) {
    object[method.name] = method;

    return object;
  }
  class InputValidator {
    isEmpty(input) {
      if (!input.value) {
        alert("Input cannot be empty!");
        return;
      } else {
        return true;
      }
    }
  }
  function isUnique(array, input) {
    if (array.some((item) => item.title === input.value)) {
      alert("Value already exists");
      return;
    } else {
      console.log("isUnique, Value is unique");
      return true;
    }
  }
  function isUniqueForOthers(input,array,  index){
    

    const copiedArray = array.slice();
    const  splicedArray = copiedArray.splice(index, 1);
    
  
    if (copiedArray.some((item) => item.title === input.value)) {
      alert("Value already exists");
      return;
    } else {
      console.log("isUniqueForOthers, Value is unique");
      return true;
    }

  }
  const inputValidator = new InputValidator();
 const inputUniqueValidator = addMethod(new InputValidator(), isUnique);
 const inputIsUniqueForOthers = addMethod(new InputValidator(), isUniqueForOthers)

  return {
    inputValidator,
    inputUniqueValidator,
    inputIsUniqueForOthers
    
  };
};
const { inputValidator, inputUniqueValidator,  } = validateInput();
const array = ["value1", "value2"];
const input = { value: "value3" };
// const inputUniqueValidator = addMethod(new InputValidator(), isUnique);
inputUniqueValidator.isEmpty(input);
inputUniqueValidator.isUnique(array, input);
