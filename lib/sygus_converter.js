'use babel';

import {escapeRegExp, sygusJsMap} from './utils.js';
import {smt_parser} from './parsers/smt_parser.js';
import {astToJs} from './parsers/astToJS.js';
import {jsToSygus} from './parsers/js_parser';

//integrate the sygusSolution into the oldCode
export function sygusToCode(sygusSolution, oldCode) {
  console.log(sygusSolution);
  if (sygusSolution.trim() == "unknown") {
    console.log("couldnt find a repair");
    return oldCode;
  }
  var fxnDefs = sygusSolution.split("\n").slice(1);
  var extractDef = new RegExp(/\(.*?\)\) [^ ]* /);
  fxnDefs = fxnDefs.map(f => f.replace(extractDef,"").slice(0,-1));
  var fxnName = sygusSolution.split(" ")[1];
  var newFxn = fxnDefs[0];

  var newNewJsFxnBody = astToJs(smt_parser(newFxn));

  var newCode;
  var fxns = extractFunctions(code);
  for (i=0; i< fxns.length; i++){
    if (fxns[i].name == fxnName){
      newCode = [
        code.slice(0, fxns[i].blockStart+2),
        "//"+code.slice(fxns[i].blockStart+2, fxns[i].end-2).split("\n").join("\n//"),
        "\n"+newNewJsFxnBody+"\n}",
        code.slice(fxns[i].end)].join('');
    }
  }
  return newCode;
};

//TODO add types to object here
// TODO start with requering type annotations
export function extractFunctions(code) {
  var functionExtractor = require("function-extractor");
  var functions = functionExtractor.parse(code);
  functions.map(f => f.body = code.slice(f.blockStart,f.end));
  return functions;
};

header = "(set-logic SLIA)\n";

function genParams(fxn) {
  //TODO get actual type (via user provided annotations?)
  return (fxn.params).map(arg => "("+arg.name+" String)").join(" ");
}

function genFunctionDef(fxn) {
  var argNamesSygus = genParams(fxn);
  var returnType = "(String)"; //TODO get actual returnType
  var sygusBody = jsToSygus(fxn.body);
  return "(define-fun "+fxn.name+" ("+argNamesSygus+")"+returnType+sygusBody+")";
}

function genFunctionSynth(fxn, intendedExamples) {
  var argNamesSygus = genParams(fxn);
  //TODO get actual return type
  var synthCommand = "(synth-fun "+fxn.name+" ("+argNamesSygus+") String \n";
  return synthCommand + genGrammar(fxn.params, intendedExamples);
};

//TODO select grammar elements based on user code
function genGrammar(params, intendedExamples) {
  var exConsts = new Set();
  for (i=0; i < intendedExamples.length; i+=1) {
    //exConsts.push(JSON.stringify(intendedExamples[i]));
    for (j=intendedExamples[i].indexOf("(")+1; j < intendedExamples[i].length; j++) {
      if (intendedExamples[i][j]!="\"") {
         exConsts.add(JSON.stringify(intendedExamples[i][j]));
      }
    }
  }
  return (`((Start String (ntString))
(ntString String (`+
  (params.map(c => c.name)).join(" ") + " " +
  (Array.from(exConsts).join(" ")) +
  `(str.++ ntString ntString)
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

  //preprocess any multicall examples
  for (i=0; i < intendedExamples.length; i+=1) {
    if (intendedExamples[i].replace(/[^(]/g, "").length > 1) {
      console.warn("multi function calls not yet supported in PBE mode. Removing: "+intendedExamples[i]);
      intendedExamples.splice(i, 2);
      i = i+1;
    }
  }

  var fxns = extractFunctions(code);
  var fxnDefs = [];
  var declarations = "";
  var constraints = "";
  var changedFxns = getFxnsWithChangedExamples(intendedExamples, currentEvalOfExamples);

  genFunctionDef(fxns[0]);

  for (i=0; i<fxns.length; i++){
    //TODO only try to synth one fxn at a time
    // others should go into 'define-fun' blocks
    var fxn = fxns[i];
    if (changedFxns.has(fxn.name)) {
      fxnDefs.push(genFunctionSynth(fxn, intendedExamples));
      declarations += fxn.params.map(p => "(declare-var "+p.name+ " String)").join("\n");
      constraints += examplesToSygusConstraints(intendedExamples,fxn.name)
      break;
    }
  }


  return header+fxnDefs.join("\n")+
          declarations+"\n"+
          constraints+
          "(check-synth)";
};
