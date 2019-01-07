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
  var extractedExs;
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == (pbeFile+".examples")) {
      var rawExamples = item.getText().trim();

      //TODO if a user uses the splitter char in the examples, parse error
      const splitter = "#"
      var exElems = rawExamples.replace(/=/g, splitter)
                               .replace(/\n/g,splitter)
                               .split(splitter);
      console.log(exElems.toString());
      for (i = 0; i < exElems.length; i+=2) {
        exElems[i] = JSON.stringify(exElems[i].trim());
      }
      try {
        extractedExs = JSON.parse("["+exElems.join(",")+"]");
      }
      //json parse error
      catch (e) {
        console.error(e);
        return;
      }
    }
  });
  console.log(extractedExs.toString());
  return extractedExs;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      var formattedExs = ""
      for (i=0; i<examples.length; i+=2){
        formattedExs += examples[i]+" = "+JSON.stringify(examples[i+1])+"\n";
      }
      //remove the extra  newline,
      formattedExs = formattedExs.slice(0,-1);
      item.setText(formattedExs);
    }
  });
};
