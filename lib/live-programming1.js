'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import { getCode, setCode, getExamples, setExamples } from './interface_helpers.js'
import { reeval, isPBEMode, pbeRepair } from './pbe_helpers.js'

pbeFile = null;
previousExamples = null;
repaired = false;

function updateCodeEval() {
  examples = getExamples(pbeFile)
  code = getCode(pbeFile)

  // pane is slow to open
  if (JSON.stringify(examples) == "[\"\"]" || examples == undefined) {
    console.log("couldnt get examples");
    return;
  }

  // pbe mode - output example changed
  if (isPBEMode(examples,previousExamples) && !repaired) {
    console.log("trying to repair code");
    updatedCode = pbeRepair(code,examples);
    //after a repair, dont try again
    //TODO remove this but still avoid infinite loop
    repaired = true;
    setCode(pbeFile,updatedCode);
    //if we didn't find a synthesis solution
    //we will overwrite the examples
    //TODO this does not seem helpful to the user
    previousExamples = examples;
  }
  // testing mode
  else {
      //console.log("trying to run tests");
      updatedExamples = reeval(code,examples);
      setExamples(updatedExamples);
      previousExamples = updatedExamples;
      repaired = false;
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
