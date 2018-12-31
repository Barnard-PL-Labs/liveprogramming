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
      catch (e) { return; }
    }
  });
  return extractedExs;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      item.setText(JSON.stringify(examples));
    }
  });
};
