'use babel';

import LiveProgramming1 from '../lib/live-programming1';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('LiveProgramming1', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('live-programming1');
  });

  describe('when the live-programming1:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.live-programming1')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'live-programming1:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.live-programming1')).toExist();

        let liveProgramming1Element = workspaceElement.querySelector('.live-programming1');
        expect(liveProgramming1Element).toExist();

        let liveProgramming1Panel = atom.workspace.panelForItem(liveProgramming1Element);
        expect(liveProgramming1Panel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'live-programming1:toggle');
        expect(liveProgramming1Panel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.live-programming1')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'live-programming1:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let liveProgramming1Element = workspaceElement.querySelector('.live-programming1');
        expect(liveProgramming1Element).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'live-programming1:toggle');
        expect(liveProgramming1Element).not.toBeVisible();
      });
    });
  });
});
