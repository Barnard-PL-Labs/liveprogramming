var eval_pbe_helpersFxns = require('./javascript/eval_pbe_helpers.js')
var updateCodeEvalJS = eval_pbe_helpersFxns.updateCodeEvalJS
var pbeRepair = eval_pbe_helpersFxns.pbeRepair
var reeval = eval_pbe_helpersFxns.reeval

var interface_helpersFxns = require('./javascript/interface_helpers.js')
var parseExamples = interface_helpersFxns.parseExamples
var writeExamples = interface_helpersFxns.writeExamples


var consoleMsg = function(){
  console.log("this is a test message. we bring you ack to your regularly scheduled programming.")
}

module.exports = {
  updateCodeEvalJS: updateCodeEvalJS,
  pbeRepair: pbeRepair,
  reeval: reeval,
  parseExamples: parseExamples,
  writeExamples: writeExamples,
  console: consoleMsg
}
