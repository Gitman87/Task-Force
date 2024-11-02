
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
      console.log("Value is unique");
      return true;
    }
  }
  const inputValidator = new InputValidator();
  const inputUniqueValidator = addMethod(new InputValidator(), isUnique);

  return {
    inputValidator,
    inputUniqueValidator,
  };
};
const { inputValidator, inputUniqueValidator } = validateInput();
const array = ["value1", "value2"];
const input = { value: "value3" };
// const inputUniqueValidator = addMethod(new InputValidator(), isUnique);
inputUniqueValidator.isEmpty(input);
inputUniqueValidator.isUnique(array, input);
