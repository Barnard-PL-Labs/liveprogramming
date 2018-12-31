'use babel';

//integrate the sygusSolution into the oldCode
export function sygusToCode(sygusSolution, oldCode) {
  return "";
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
  var synthCommand = "(synth-fun "+fxnName+" ("+argNamesSygus.join(" ")+") String"; //TODO get return type

  return synthCommand + genGrammar(argNames)
};

//TODO select grammar elements based on user code
function genGrammar(consts) {
  return (`((Start String (ntString))
(ntString String (`+(consts.map(c => c.name)) +` \" \"
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
  (str.contains ntString ntString)))))`);
}

// convert code (fxn defs) and examples to sygus and
// get implemetations for the fxns
export function codeToSygus(code, examples) {

  var fxns = extractFunctions(code);
  var fxnDefs = [];
  var declarations = "";
  fxns.forEach ( function(fxn) {
    fxnDefs.push(genFunctionSynth(fxn.name, fxn.params));
    declarations += fxn.params.map(p => "(declare-var "+p.name+ "String)").join("\n");
  });

  var constraints = "";
  for (i=0; i < examples.length; i+=2){
    examples[i].replace("(|)|,/g",
    constraints += "(constraint (= ("+fxnName+" \"+input+\") \""+output+"\"))");
  return header+fxnDefs.join("\n")+declarations+constraints+"(check-synth)";
};
