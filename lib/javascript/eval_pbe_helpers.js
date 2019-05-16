'use babel';

const vm = require('vm');

import { codeToSygus, sygusToCode } from './sygus_converter.js'
import { updateCodeEval, isPBEMode } from '../general/eval_pbe_helpers.js'

// when the user edits code, we keep tests up to date
export function reeval(code, examples) {
  //make a copy since js is pass-by-reference
  var newExamples = examples.slice();
  //console.log(code + " "+examples[0]);
  for (var i=0; i<newExamples.length; i+=1){
    try {
      var sandbox = {};
      vm.runInNewContext(code + " output=" + newExamples[i].call + ";", sandbox);
      var r = sandbox.output;
      newExamples[i].res = JSON.stringify(r);
      newExamples[i].resType = typeof(r);
    }
    catch (e) {
      console.warn("syntax error i think");
      // syntax error
      // pbe code is probably in process of being changed
    }
  };

  return newExamples;
};

function getTimeStamp(){
  var date = new Date();
  return "."+date.getTime();
}
// given code and examples,
// how can we fix the code to fit the examples
// The sygus file is written to path
export function pbeRepair(code, examples, currentOutput, path) {
  const fs = require('fs');
  var sygusCode = codeToSygus(code, examples, currentOutput)
  fs.writeFileSync(path, sygusCode);
  fs.writeFileSync(path + getTimeStamp(), codeToSygus(code, examples, currentOutput));
  var execSync = require('child_process').execSync, cvc4Output;
  var cvc4Output = null;
  try {
    cvc4Output = execSync('doalarm () { perl -e \'alarm shift; exec @ARGV\' "$@"; }\n doalarm 1 cvc4 '+path).toString();
  }
  catch (e) {
    console.error("CVC4 call failed: "+e);
  }
  if (cvc4Output !== null) {
    newCode = sygusToCode(cvc4Output, code);
  }
  else {
    newCode = code
  }
  return newCode;
}

export function updateCodeEvalJS(code, examples, path) {
  return updateCodeEval({ repair: (c, ne, pe) => pbeRepair(c, ne, pe, path)
                        , eval:reeval }, code, examples, path)
}
