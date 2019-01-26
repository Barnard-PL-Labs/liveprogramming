'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import { getCode, setCode, getExamples, setExamples } from './atom/interface_helpers.js'
import { reeval, pbeRepair, updateCodeEvalJS } from './javascript/eval_pbe_helpers.js'

pbeFile = null;
previousExamples = [];
repaired = false;

function updateCodeEvalAtom() {
  var code = getCode(pbeFile)
  var examples = getExamples(pbeFile)

  var path = atom.workspace.getActiveTextEditor().getPath()+".sl"
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
    currentFile = atom.workspace.getActiveTextEditor().getPath();
    atom.workspace.open(currentFile+".examples",{split: "right"});
    pbeFile = atom.workspace.getActiveTextEditor().getTitle();

    // register callbacks
    atom.workspace.getActiveTextEditor().onDidChange(updateCodeEvalAtom);
    atom.workspace.onDidChangeActivePaneItem(updateCodeEvalAtom);
  },

  deactivate() {
    this.subscriptions.dispose();
  },



  deserializeLiveProgramming1View(serialized) {
    return new LiveProgramming1View();
  },


  toggle() {
    atom.workspace.toggle('atom://live-programming1');
  },

};
