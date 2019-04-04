'use babel';

import { CompositeDisposable, Disposable, File } from 'atom';
import { getCode, setCode, getExamples, setExamples, convertToHidden } from './atom/interface_helpers.js'
import { reeval, pbeRepair, updateCodeEvalJS } from './javascript/eval_pbe_helpers.js'

pbeFile = null;
previousExamples = [];
repaired = false;

function updateCodeEvalAtom() {
  var code = getCode(pbeFile)
  var examples = getExamples(pbeFile)

  var fpath = atom.workspace.getActiveTextEditor().getPath();
  var path = convertToHidden(fpath).getPath()+".sl";
  var res = updateCodeEvalJS(code, examples, path)

  if (res.newCode != null) {
    setCode(pbeFile, res.newCode);
  }
  if (res.newExamples != null) {
    setExamples(res.newExamples);
  }
}

export default {

  subscriptions: null,

  activate(state) {
    //which files do we need?
    //once the package is activated it can only work on one file
    //TODO allow for toggling off the package
    //TODO make package aware of the current file
    var codeTE = atom.workspace.getActiveTextEditor()
    currentFile = codeTE.getPath();

    // var exFile = new File(currentFile + ".examples");
    var exFile = convertToHidden(currentFile + ".examples");
    exFile.create().then( b => {
      atom.workspace.open(exFile.getPath(), {split: "right"}).then(
        t => {
          pbeFile = codeTE.getTitle();

          // register callbacks
          codeTE.onDidChange(updateCodeEvalAtom);
          atom.workspace.onDidChangeActivePaneItem(updateCodeEvalAtom);
        }
      );
    })
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  deserializeLiveProgramming1View(serialized) {
    return new LiveProgramming1View();
  },

  // Toggles the package view on and off
  toggle() {
    atom.workspace.toggle(LiveProgrammingView.element);
  },

};
