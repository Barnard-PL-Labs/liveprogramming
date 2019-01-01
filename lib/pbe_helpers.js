'use babel';

import { codeToSygus, sygusToCode } from './sygus_converter.js'

// when the user edits code, we keep tests up to date
export function reeval(code, examples) {
  //make a copy since js is pass-by-reference
  newExamples = examples.slice();
  //console.log(code + " "+examples[0]);
  try {
  for (i=0;i<newExamples.length; i+=2){
    newExamples[i+1] = eval(code+" "+newExamples[i]+";");
  };
  }
  catch (e) {
    // syntax error
    // pbe code is probably in process of being changed
  }
  return newExamples;
};

// We should only enter synthesis mode when the user
// changes only output example(s)
export function isPBEMode(examples, previousExamples) {
  var outputExampleChanged = false
  var inputExampleChanged = false

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
export function pbeRepair(code, examples) {
  const fs = require('fs');
  //TODO pass 'path' in as arg to avoid atom api magic in this file
  var path = atom.workspace.getActiveTextEditor().getPath()+".sl"
  var currentOutput = reeval(code, examples);
  fs.writeFileSync(path, codeToSygus(code, examples, currentOutput));
  var exec = require('child_process').exec, child;
  child = exec('cvc4 --tlimit=500 '+path,
      function (error, stdout, stderr) {
          //console.log('stdout: ' + stdout);
          //console.log('stderr: ' + stderr);
          console.log(sygusToCode(stdout,code));
          if (error !== null) {
               console.log('exec error: ' + error);
          }
      });
  return code; //sygusToCode(stdout,code);
}
