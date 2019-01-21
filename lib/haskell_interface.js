'use babel';

export function reevalHs(code, examples) {
  const fs = require('fs');

  var dir = atom.workspace.getActiveTextEditor().getBuffer().file.getParent().getPath()
  var path = atom.workspace.getActiveTextEditor().getPath()+".temp.hs"
  fs.writeFileSync(path, code)

  var execSync = require('child_process').execSync, out;
  try {
    out = execSync(dir + '/G2Live ' +  dir + ' ' + path + " --config "  + dir + '/g2.cfg').toString();
  }
  catch (e) {
    console.error("G2 call failed: " + e)
    out = examples
  }
  return out;
}

// given code and examples,
// how can we fix the code to 1fit the examples
export function pbeRepairHs(code, examples) {
  newCode = code;
}

export function getExamplesHs(pbeFile) {
  var extractedExs;
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == (pbeFile+".examples")) {
      var rawExamples = item.getText().trim();

      console.log("raw = " + rawExamples)

      //TODO if a user uses the splitter char in the examples, parse error
      const splitter = "#@#"
      var exElems = rawExamples.replace(/=/g, splitter)
                               .replace(/\n/g,splitter)
                               .split(splitter);
      console.log("exElems = " + exElems.toString());
      for (i = 0; i < exElems.length; i+=1) {
        exElems[i] = JSON.stringify(exElems[i].trim());
      }
      try {
        console.log("["+exElems.join(",")+"]")
        extractedExs = JSON.parse("["+exElems.join(",")+"]");
        console.log("ex = " + extractedExs)
      }
      //json parse error
      catch (e) {
        console.error(e);
        return;
      }
    }
  });
  return extractedExs;
};


export function setExamplesHs(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      item.setText(examples);
    }
  });
};
