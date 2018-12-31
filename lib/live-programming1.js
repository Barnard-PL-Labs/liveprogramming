'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import { getCode, setCode, getExamples, setExamples } from './interface_helpers.js'
import { reeval, isPBEMode, pbeRepair } from './pbe_helpers.js'

pbeFile = null;
previousExamples = null;

function updateCodeEval() {
  examples = getExamples()
  code = getCode(pbeFile)

  // pane is slow to open
  if (examples == undefined) { return; }

  // pbe mode - output example changed
  if (isPBEMode(examples,previousExamples)) {
    //console.log("trying to repair code");
    updatedCode = pbeRepair(code,examples);
    setCode(updatedCode);
  }
  // testing mode
  else {
      //console.log("trying to run tests");
      updatedExamples = reeval(code,examples);
      setExamples(updatedExamples);
      previousExamples = examples;
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
    atom.workspace.getActiveTextEditor().onDidChange(updateCodeEval);
    atom.workspace.onDidChangeActivePaneItem(updateCodeEval);
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
