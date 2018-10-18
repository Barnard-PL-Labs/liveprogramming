'use babel';

export default class LiveProgramming1View {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('live-programming1');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The LiveProgramming1 package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
  if (!atom.workspace.isTextEditor(item)) {
    message.innerText = 'Open a file to see important information about it.';
    return;
  }
  message.innerHTML = `
    <h2>${item.getFileName() || 'untitled'}</h2>
    <ul>
      <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
      <li><b>Tab Length:</b> ${item.getTabLength()}</li>
      <li><b>Encoding:</b> ${item.getEncoding()}</li>
      <li><b>Line Count:</b> ${item.getLineCount()}</li>
      <li><b>Text:</b> ${eval(item.getText())}</li>
    </ul>
    <form>
      <input type="text">
    </form>
  `;
});
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'live-programming1/LiveProgramming1View'
    };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Live Programming1';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://live-programming1';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom'];
  }

}
