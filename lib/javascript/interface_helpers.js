'use babel';

//can i refactor this into an object?
// Parses examples, formatted for JavaScript, from a string
export function parseExamples(text) {
  var ex = []
  //TODO if a user uses the splitter char in the examples, parse error
  const splitter = "#@#"
  var exElems = text.replace(/=/g, splitter)
                    .replace(/\n/g,splitter)
                    .split(splitter);
  var strEx = exElems.map(e => e.trim());
  var j = 0
  for (i = 0; i < strEx.length; i+=2) {
    try {
      var out = JSON.parse(strEx[i + 1])
      ex[j] = {call: strEx[i], res: strEx[i + 1], resType: typeof(out)};
      j += 1
    }
    catch (e) {
      ex[j] = {call: strEx[i], res: "null", resType: typeof(null)};
    }
  }
  return ex;
}

// Writes examples, formatted for JavaScript, from a list
export function writeExamples(examples) {
  var formattedExs = ""
  for (i=0; i<examples.length; i+=1){
    formattedExs += examples[i].call + " = " + examples[i].res + "\n";
  }
  //remove the extra  newline,
  formattedExs = formattedExs.slice(0,-1);
  return formattedExs;
}
