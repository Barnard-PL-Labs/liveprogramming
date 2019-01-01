'use babel';

import {escapeRegExp, sygusJsMap} from './utils.js';
import {smt_parser} from './smt_parser.js';
import {astToJs} from './astToJS.js';

//integrate the sygusSolution into the oldCode
export function sygusToCode(sygusSolution, oldCode) {
  if (sygusSolution=="unknown") {
    return oldCode;
  }
  var fxnDefs = sygusSolution.split("\n").slice(1);
  var extractDef = new RegExp(/\(.*\) [^\(]* /g);
  fxnDefs = fxnDefs.map(f => f.replace(extractDef,"").slice(0,-1));
  //TODO convert this prefix function to javascript
  var newFxn = fxnDefs[0];

  var re = new RegExp( Object.keys(sygusJsMap).map(k => escapeRegExp(k)).join("|"), "ig");
  newFxn = newFxn.replace(re, function(m) {
      return sygusJsMap[m];
  });
  return astToJs(smt_parser(newFxn));
};

//TODO add types to object here
// TODO start with requering type annotations
export function extractFunctions(code) {
  var functionExtractor = require("function-extractor");
  var functions = functionExtractor.parse(code);
  return functions;
};

header = "(set-logic SLIA)\n";

function genFunctionSynth(fxnName, argNames) {
  var argNamesSygus = argNames.map(arg => "("+arg.name+" String)"); //TODO get type
  var synthCommand = "(synth-fun "+fxnName+" ("+argNamesSygus.join(" ")+") String \n"; //TODO get return type

  return synthCommand + genGrammar(argNames)
};

//TODO select grammar elements based on user code
function genGrammar(consts) {
  return (`((Start String (ntString))
(ntString String (`+(consts.map(c => c.name)).join(" ") +` \" \"
  (str.++ ntString ntString)
  (str.replace ntString ntString ntString)
  (str.at ntString ntInt)
  (str.substr ntString ntInt ntInt)))
(ntInt Int (0 1 2 3 4 5
  (+ ntInt ntInt)
  (- ntInt ntInt)
  (str.len ntString)
  (str.indexof ntString ntString ntInt)))
(ntBool Bool (true false
  (str.prefixof ntString ntString)
  (str.suffixof ntString ntString)
  (str.contains ntString ntString)))))\n`);
};

// for which fxns did the user change the output example
function getFxnsWithChangedExamples(intendedExamples,currentEvalOfExamples) {
  var changedFxns = new Set();
  for (i=0; i < intendedExamples.length; i+=2) {
    if (intendedExamples[i+1] != currentEvalOfExamples[i+1]) {
      changedFxns.add(intendedExamples[i].split('(')[0]);
    }
  }
  return changedFxns;
};

function examplesToSygusConstraints(intendedExamples,fxnName) {
  var constraints = "";
  for (i=0; i < intendedExamples.length; i+=2){
    if (intendedExamples[i].split('(')[0] == fxnName){
      constraints += "(constraint (= ("+intendedExamples[i].replace(/\(|\)|,/g," ")+") " +
      JSON.stringify(intendedExamples[i+1])+"))\n";
    }
  }
  return constraints;
};

// convert code (fxn defs) and examples to sygus and
// get implemetations for the fxns
export function codeToSygus(code, intendedExamples, currentEvalOfExamples) {

  var fxns = extractFunctions(code);
  var fxnDefs = [];
  var declarations = "";
  var constraints = "";
  var changedFxns = getFxnsWithChangedExamples(intendedExamples, currentEvalOfExamples);

  for (i=0; i<fxns.length; i++){
    //TODO only try to synth one fxn at a time
    // others should go into 'define-fun' blocks
    var fxn = fxns[i];
    if ( changedFxns.has(fxn.name)) {
      fxnDefs.push(genFunctionSynth(fxn.name, fxn.params));
      declarations += fxn.params.map(p => "(declare-var "+p.name+ " String)").join("\n");
      constraints += examplesToSygusConstraints(intendedExamples,fxn.name)
      break;
    }
  }


  return header+fxnDefs.join("\n")+
          declarations+
          constraints+
          "(check-synth)";
};
