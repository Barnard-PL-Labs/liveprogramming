'use babel';

import { parseExamples, writeExamples } from '../javascript/interface_helpers.js'

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
    if (item.getTitle() == (pbeFile+".examples")) {
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
