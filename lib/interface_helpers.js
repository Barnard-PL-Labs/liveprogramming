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
      try {
         extractedExs = JSON.parse(item.getText());
      }
      //json parse error
      catch (e) {
        console.error(e);
        return; }
    }
  });
  return extractedExs;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      var formattedExs = "["
      for (i=0; i<examples.length; i+=2){
        formattedExs += JSON.stringify(examples[i])+", "+JSON.stringify(examples[i+1])+",\n";
      }
      //remove the extra comma and newline, and close the array
      formattedExs = formattedExs.slice(0,-2) + "]";
      item.setText(formattedExs);
    }
  });
};
