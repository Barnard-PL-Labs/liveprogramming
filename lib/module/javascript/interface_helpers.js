//can i refactor this into an object?
// Parses examples, formatted for JavaScript, from a string
var parseExamples = function parseExamples(text) {
  var ex = []
  //TODO if a user uses the splitter char in the examples, parse error
  const splitter = "#@#"

  var exElems = text.split("\n").map(e => e.split("="))
  var strEx = exElems.map(e => e.map(p => p.trim()));

  for (var i = 0; i < strEx.length; i += 1) {
    try {
      var out = JSON.parse(strEx[i][1])
      ex[i] = {call: strEx[i][0], res: strEx[i][1], resType: typeof(out)};
    }
    catch (e) {
      ex[i] = {call: strEx[i][0], res: "null", resType: typeof(null)};
    }
  }
  //console.log(exElems)
  //console.log(ex)
  return ex;
}

// Writes examples, formatted for JavaScript, from a list
var writeExamples = function writeExamples(examples) {
  var formattedExs = ""
  for (var i = 0; i<examples.length; i+=1){
    formattedExs += examples[i].call + " = " + examples[i].res + "\n";
  }
  //remove the extra  newline,
  formattedExs = formattedExs.slice(0,-1);
  return formattedExs;
}

module.exports = {
  parseExamples: parseExamples,
  writeExamples: writeExamples
}
