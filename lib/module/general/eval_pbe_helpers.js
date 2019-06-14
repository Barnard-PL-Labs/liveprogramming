// funcs is a dictionary, containing two functions:
// 1) eval: takes the code and examples as inputs,
//    returns new examples as output
// 2) repair: takes the code, new examples, and previous examples
//    as inputs, returns new code as output.
repaired = true
previousExamples = [];
var updateCodeEval = function updateCodeEval(funcs, code, examples) {

  // pane is slow to open
  if (JSON.stringify(examples) == "[\"\"]" || examples == undefined) {
    console.log("couldn't get examples");
    return { newCode: null, newExamples:null };;
  }
  // pbe mode - output example changed
  if (isPBEMode(examples,previousExamples)) {
    console.log("trying to repair code");
    updatedCode = funcs.repair(code, examples, previousExamples);
    //if we didn't find a synthesis solution
    //we will overwrite the examples
    //TODO this does not seem helpful to the user
    previousExamples = examples;
    updatedCode = { newCode: updatedCode, newExamples:null };
  }
  // testing mode
  else {
      console.log("trying to run tests");
      updatedExamples = funcs.eval(code,examples);
      previousExamples = updatedExamples;
      updatedCode = { newCode: null, newExamples: updatedExamples }
  }
  return updatedCode
}

// We should only enter synthesis mode when the user
// changes only output example(s)
var isPBEMode = function isPBEMode(examples, previousExamples) {
  var outputExampleChanged = false
  var inputExampleChanged = false

  if (previousExamples.length == 0) {
    return false;
  }
  if (examples.length != previousExamples.length) {
    return false;
  }

  for (i=0; i < examples.length; i+=1){
      inputExampleChanged = inputExampleChanged ||
        examples[i].call != previousExamples[i].call
      outputExampleChanged = outputExampleChanged ||
        examples[i].res != previousExamples[i].res;
  }
  var pbemode =
    examples.length == previousExamples.length &&
    outputExampleChanged &&
    !inputExampleChanged;
  return pbemode
};

module.exports = {
  updateCodeEval: updateCodeEval,
  isPBEMode: isPBEMode
}
