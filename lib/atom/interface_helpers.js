'use babel';

import { File } from 'atom';

var backendFxns = require('live-backend-nfn5')
var parseExamples = backendFxns.parseExamples
var writeExamples = backendFxns.writeExamples

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
  var ex = []
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) { //grabs from the example pane
      var rawExamples = item.getText().trim();
      ex = parseExamples(rawExamples);
    }
  });
  return ex;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      var formattedExs = writeExamples(examples);
      item.setText(formattedExs);
    }
  });
};

// Changes the file path to place the file in a hidden folder, ".live"
export function convertToHidden(file) {
  var cfile;
  if (typeof file == "string") {
    cfile = new File(file);
  }
  else {
    cfile = file;
  }

  var dirPath = cfile.getParent();
  var base = cfile.getBaseName();
  var ret = new File(dirPath.getPath() + "/.live/" + base)
  return ret;
}
