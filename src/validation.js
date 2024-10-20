class inputValidator {
  static typesOfInput = ["text", "number", "date"]; // short - for this project purpose

  checkTypeOfInput(input) {
    const typeIndex = this.typesOfInput.indexOf(input.type);
    if (typeIndex >= 0) {
      console.log(`Type of this input is: ${this.typesOfInput[typeIndex]}`);

      return this.typesOfInput[typeIndex];
    } else {
      console.warn(
        `Unknown type of input: ${input.type} Please extend typesOfInput if exists`
      );
      return null;
    }
  }
}
