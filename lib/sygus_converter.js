'use babel';

//integrate the sygusSolution into the oldCode
export function sygusToCode(sygusSolution, oldCode) {
  return "";
};

export function extractFunctions(code) {
  var functionExtractor = require("function-extractor");
  var functions = functionExtractor.parse(code);
  return functions;
};

// convert code (fxn defs) and examples to sygus and
// get implemetations for the fxns
export function codeToSygus(code, examples) {

  functionNames = extractFunctions(code)
  /*
  header = "(set-logic SLIA)\n"
  function functionDef(fxnName) {
      return "(synth-fun "+fxnName+" ((input String)) String";
    }
  language = `((Start String (ntString))
       (ntString String (input \" \"
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
                      (str.contains ntString ntString)))))`;

  function exampleConstraint(fxnName,input,output) {
    return "(constraint (= ("+fxnName+" \"+input+\") \""+output"\"))";
  }

  // ="(declare-var input String)"
*/
  //return header+ "(check-synth)";
  return "";
};
