'use babel';

import LiveProgramming1View from './live-programming1-view';
import { CompositeDisposable, Disposable } from 'atom';


function updateCodeEval() {
  atom.workspace.getPaneItems().forEach(item => {
    if (item instanceof LiveProgramming1View) {
      item.reeval();
    }
  });

}

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://live-programming1') {
          return new LiveProgramming1View();

        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'live-programming1:toggle': () => this.toggle()
      }),

      // Destroy any ActiveEditorInfoViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof LiveProgramming1View) {
            item.destroy();
          }
        });
      })
    );

    atom.workspace.getActiveTextEditor().onDidChange(updateCodeEval);


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
