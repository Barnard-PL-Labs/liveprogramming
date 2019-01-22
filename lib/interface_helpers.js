'use babel';

//can i refactor this into an object?

export function getCode(pbeFile) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == pbeFile) {
      code = item.getText();
    }
  });
  return code;
};

export function setCode(pbeFile, code) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == pbeFile) {
      item.setText(code);
    }
  });
};

export function getExamples(pbeFile) {
  var ex = [];
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == (pbeFile+".examples")) {
      var rawExamples = item.getText().trim();

      //TODO if a user uses the splitter char in the examples, parse error
      const splitter = "#@#"
      var exElems = rawExamples.replace(/=/g, splitter)
                               .replace(/\n/g,splitter)
                               .split(splitter);
      var strEx = exElems.map(e => JSON.stringify(e.trim()));
      for (i = 0; i < strEx.length; i+=2) {
        ex[i / 2] = {call: strEx[i], res: strEx[i + 1], resType: typeof(exElems[i + 1])};
      }
    }
  });
  return ex;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      var formattedExs = ""
      for (i=0; i<examples.length; i+=1){
        formattedExs += JSON.parse(examples[i].call)+" = "+examples[i].res+"\n";
      }
      //remove the extra  newline,
      formattedExs = formattedExs.slice(0,-1);
      item.setText(formattedExs);
    }
  });
};
