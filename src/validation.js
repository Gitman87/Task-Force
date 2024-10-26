// const validateInput = () => {
//   class InputValidator {
//     static typesOfInput = ["text", "number", "date"]; // short - for this project purpose

//     static checkTypeOfInput(input) {
//       const typeIndex = this.typesOfInput.indexOf(input.type);
//       if (typeIndex >= 0) {
//         console.log(`Type of this input is: ${this.typesOfInput[typeIndex]}`);

//         return this.typesOfInput[typeIndex];
//       } else {
//         console.warn(
//           `Unknown type of input: ${input.type} Please extend typesOfInput if exists`
//         );
//         return null;
//       }
//     }

//     constructor(input) {
//       this.type = InputValidator.checkTypeOfInput(input);
//     }
//     isEmpty(input) {
//       if (!input.value) {
//         alert("Input cannot be empty!");
//         return null;
//       }
//     }
//     isUnique(array, input) {
//       if (array.some(input.value)) {
//         alert("Value already exists");
//         return null;
//       } else {
//         console.log("Value is unique");
//       }
//     }
//   }
// };

// class UniqueChecker {
//   check(array, input) {
//     if (array.some(input.value)) {
//       alert("Value already exists");
//       return null;
//     } else {
//       console.log("Value is unique");
//     }
//   }
// }
// const uniqueCheckerFactory = () => {
//   const uniqueChecker = new UniqueChecker();
//   return uniqueChecker;
// };

// =====================REISSUE===============================
export const validateInput = () => {
  function addMethod(object, method) {
    object[method.name] = method;

    return object;
  }
  class InputValidator {
    isEmpty(input) {
      if (!input.value) {
        alert("Input cannot be empty!");
        return false;
      }
      else{
        return true;
      }
    }
  }
  function isUnique(array, input) {
    if (array.some((item) => item === input.value)) {
      alert("Value already exists");
      return false;
    } else {

      console.log("Value is unique");
      return true;
    }
  }
  const inputValidator = new InputValidator();
  const inputUniqueValidator = addMethod(new InputValidator(), isUnique);

  return {
    inputValidator,
    inputUniqueValidator
  };
};
const { inputValidator, inputUniqueValidator } = validateInput();
const array = ["value1", "value2"];
const input = { value: "value3" };
// const inputUniqueValidator = addMethod(new InputValidator(), isUnique);
inputUniqueValidator.isEmpty(input);
inputUniqueValidator.isUnique(array, input);
