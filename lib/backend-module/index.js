var eval_pbe_helpersFxns = require('./javascript/eval_pbe_helpers.js')
var updateCodeEvalJS = eval_pbe_helpersFxns.updateCodeEvalJS
var reeval = eval_pbe_helpersFxns.reeval

var consoleMsg = function(){
  console.log("this is a test message. we bring you ack to your regularly scheduled programming.")
}

module.exports = {
  updateCodeEvalJS: updateCodeEvalJS,
  reeval: reeval,
  console: consoleMsg
}
