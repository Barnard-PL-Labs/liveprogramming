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

function getInputOutputType(intendedExamples, fxn){
  var paramTypes = {};

  var types = new Array();
  var outputType;
  var typeofToSmtTypeMap = {"number": "Int", "string": "String", "boolean": "Bool"};
  var regExp = /\(([^)]+)\)/;

  for (i=0; i < intendedExamples.length; i+=1) {
    if(intendedExamples[i].call.includes(fxn.name)){
    var params = (regExp.exec(intendedExamples[i].call)[1]).split(",");
    for (j=0; j < params.length; j++) {
      paramTypes[(fxn.params)[j].name] = typeofToSmtTypeMap[typeof eval(params[j])];
    }

    outputType = intendedExamples[i].resType;
    console.log("output type of "+ fxn.name+ "(): " + outputType)

    types[0] = paramTypes;
    console.log(JSON.stringify(paramTypes));
    types[1] = typeofToSmtTypeMap[outputType];

    return types;


  }
}
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

function genParams(fxn, inType) {
  //TODO get actual type (via user provided annotations?)
  return (fxn.params).map(arg => "("+arg.name+" "+inType[arg.name]+")").join(" ");
}

function genFunctionDef(fxn, inType, outType) {

  var argNamesSygus = genParams(fxn, inType);
  var returnType = "("+outType+")"; //TODO get actual returnType
  var sygusBody = jsToSygus(fxn.body);
  return "(define-fun "+fxn.name+" ("+argNamesSygus+")"+" "+returnType+sygusBody+")";
}

function genFunctionSynth(fxn, intendedExamples) {
  var types = getInputOutputType(intendedExamples, fxn);
  var paramTypes = types[0];
  var returnType = types[1];
  //console.log(returnType);
  var argNamesSygus = genParams(fxn, paramTypes);
  //TODO get actual return type
  var synthCommand = "(synth-fun "+fxn.name+" ("+argNamesSygus+") "+returnType+ " \n";
  return synthCommand + genGrammar(fxn.params, intendedExamples, paramTypes, returnType);
};

function getType(object){
  return typeof object;
};

function genConstsAndParamsString(params, inTypes, consts, type){
  var typeofToSmtTypeMap = {"number": "Int", "string": "String", "boolean": "Bool"};

  return ((params.map(c => c.name)).filter(param => inTypes[param] == type)).join(" ") + " " +
  (Array.from(consts[Object.keys(typeofToSmtTypeMap).find(key => typeofToSmtTypeMap[key] === type)]).join(" "))
};

//TODO select grammar elements based on user code
//TODO edit to allow for different types
function genGrammar(params, intendedExamples, inTypes, outType) {
  var consts = {};
  for (i=0; i < intendedExamples.length; i+=1) {
    if (intendedExamples[i].resType == "string"){
    //exConsts.push(JSON.stringify(intendedExamples[i]));
    for (j=intendedExamples[i].call.indexOf("(")+1; j < intendedExamples[i].length; j++) {
      if (intendedExamples[i].call[j]!="\"") {
         if (!isNaN(parseInt(intendedExamples[i].call[j]))) {
         if ((Object.keys(consts)).includes("number")){
           consts["number"].add(String(parseInt(intendedExamples[i].call[j])));
         } else{
           consts["number"] = new Set(String(parseInt(intendedExamples[i].call[j])));

         }

       } else {
         var type = getType(intendedExamples[i].call[j]);
         if ((Object.keys(consts)).includes(type)){
           consts[type].add(JSON.stringify(intendedExamples[i].call[j]));
         } else {
           consts[type] = new Set();
           consts[type].add(JSON.stringify(intendedExamples[i].call[j]))
         }

      }

     }
    }
  }
  }

  if (!((Object.keys(consts)).includes("string"))) {
    consts["string"] = new Set();
  }
  if (!((Object.keys(consts)).includes("number"))) {
    consts["number"] = new Set();
  }
  for (i = 0; i<=5; i++){
      consts["number"].add(String(i));
  }
  if (!((Object.keys(consts)).includes("boolean"))) {
    consts["boolean"] = new Set();
  }
  consts["boolean"].add("true");
  consts["boolean"].add("false");



  consts["number"] = new Set(Array.from(consts["number"]).filter((v, i, a) => a.indexOf(v) == i));
  consts["string"] = new Set(Array.from(consts["string"]).filter((v, i, a) => a.indexOf(v) == i));


  //console.log(Array.from(consts["string"]));
  return (`((Start `+outType+` (nt`+outType+`))
(ntString String (`+
  genConstsAndParamsString(params, inTypes, consts, "String") +
  `(str.++ ntString ntString)
  (str.replace ntString ntString ntString)
  (str.at ntString ntInt)
  (str.substr ntString ntInt ntInt)))
(ntInt Int (`+ genConstsAndParamsString(params, inTypes, consts, "Int") +`
  (+ ntInt ntInt)
  (- ntInt ntInt)
  (str.len ntString)
  (str.indexof ntString ntString ntInt)))
(ntBool Bool (`+ genConstsAndParamsString(params, inTypes, consts, "Bool") +
  `(str.prefixof ntString ntString)
  (str.suffixof ntString ntString)
  (str.contains ntString ntString)))))\n`);
};

// for which fxns did the user change the output example
function getFxnsWithChangedExamples(intendedExamples,currentEvalOfExamples) {
  var changedFxns = new Set();
  for (i=0; i < intendedExamples.length; i+=1) {
    if (intendedExamples[i].res != currentEvalOfExamples[i].res) {
      changedFxns.add(intendedExamples[i].call.split('(')[0]);
    }
  }
  return changedFxns;
};

function examplesToSygusConstraints(intendedExamples,fxnName) {
  var constraints = "";
  for (i=0; i < intendedExamples.length; i+=1){
    if (intendedExamples[i].call.split('(')[0] == fxnName){
      constraints += "(constraint (= ("+intendedExamples[i].call.replace(/\(|\)|,/g," ")+") " +
      JSON.stringify(intendedExamples[i].res)+"))\n";
    }
  }
  return constraints;
};

// convert code (fxn defs) and examples to sygus and
// get implemetations for the fxns
export function codeToSygus(code, intendedExamples, currentEvalOfExamples) {

  //preprocess any multicall examples
  // TODO: I (Bill) am commenting this out, because it appears to not actually
  // be done, and I don't understand how this loop is supposed to work.
  // Maybe write output to a separate array?
  // for (i=0; i < intendedExamples.length; i+=2) {
  //   if (intendedExamples[i].replace(/[^(]/g, "").length > 1) {
  //     console.warn("multi function calls not yet supported in PBE mode. Removing: "+intendedExamples[i]);
  //     intendedExamples.splice(i, 2);
  //     i = i+1;
  //   }
  // }

  var fxns = extractFunctions(code);

  var fxnDefs = [];
  var declarations = "";
  var constraints = "";
  var changedFxns = getFxnsWithChangedExamples(intendedExamples, currentEvalOfExamples);

  console.log("changedFxns")
  console.log(JSON.stringify(fxns))
  console.log(JSON.stringify(changedFxns))

  //var fxnDefsTemp = fxns.map(f => genFunctionDef(f));

  for (i=0; i<fxns.length; i++){
    //TODO only try to synth one fxn at a time
    // others should go into 'define-fun' blocks
    var fxn = fxns[i];
    if (changedFxns.has(fxn.name)) {
      fxnDefs.push(genFunctionSynth(fxn, intendedExamples));
      var types = getInputOutputType(intendedExamples, fxn);
      declarations += fxn.params.map(p => "(declare-var "+p.name+ " "+types[0][p.name]+")").join("\n");
      constraints += examplesToSygusConstraints(intendedExamples,fxn.name)
      break;
    }
  }


  return header+fxnDefs.join("\n")+
          declarations+"\n"+
          constraints+
          "(check-synth)";
};
