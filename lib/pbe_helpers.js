'use babel';

// when the user edits code, we keep tests up to date
export function reeval(code, examples) {
  //console.log(code + " "+examples[0]);
  try {
  for (i=0;i<examples.length; i+=2){
    examples[i+1] = eval(code+" "+examples[i]+";");
  };
  }
  catch (e) {
    // syntax error
    // pbe code is probably in process of being changed
  }
  return examples;
};

// We should only enter synthesis mode when the user
// changes only output example(s)
export function isPBEMode(examples, previousExamples) {
  outputExampleChanged = false
  inputExampleChanged = false

  if (previousExamples == null) {
    return false;
  }

  for (i=0; i < examples.length; i+=2){
      inputExampleChanged = inputExampleChanged ||
        examples[i] != previousExamples[i]
      outputExampleChanged = outputExampleChanged ||
        examples[i+1] != previousExamples[i+1];
  }
  return examples.length%2 == 0 &&
    examples.length == previousExamples.length &&
    outputExampleChanged &&
    !inputExampleChanged;
};

// given code and examples,
// how can we fix the code to fit the examples
export function pbeRepair(code,examples) {
  return code;
}
