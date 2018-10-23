'use babel';

function genExampleHtml(numExamples) {
  examplesHtml = `
  <form>
  <table style="width:100%">
  <tr>
  <th>Input</th>
  <th>Output</th>
  </tr>`;

  for(i=0;i<numExamples;i++){
    examplesHtml += `
    <tr>
    <td> <input type="text" id="input_`+i+`" name="input_`+i+`" value=""></td>
    <td> <input type="text" name="output_`+i+`" value=""></td>
    </tr>`;
  }
  examplesHtml += `</table></form>`;
  return examplesHtml;
}

export default class LiveProgramming1View {


  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('live-programming1');

    // Create message element
    const title = document.createElement('div');
    this.element.appendChild(title);
    const examples = document.createElement('div');
    this.element.appendChild(examples);

    numInitExamples = 3;
    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {

      title.innerHTML = `
        <h2>${item.getFileName() || 'untitled'}</h2>`;
      examples.innerHTML = genExampleHtml(numInitExamples);
    });

  }

  reeval() {
    atom.workspace.getCenter().observeActivePaneItem(item => {
      //the ONLY way to query this.element is getElementsByTagName
      //you cant use getElementsById or anything like that
      //https://docs.oracle.com/javase/8/docs/jre/api/plugin/dom/org/w3c/dom/html/HTMLDivElement.html
      examples = this.element.getElementsByTagName("input");
      for (i=0;i<examples.length; i+=2){
//        console.log(eval(item.getText()+" main("+examples[i].value+");"));
        examples[i+1].value = eval(item.getText()+" main("+examples[i].value+");");
      };
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
    return 'Live Programming';
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
