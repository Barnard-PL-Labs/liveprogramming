/** @jsx etch.dom */

const etch = require('etch')

// This function is to be called every time the list of examples is updated to html is changed
// eList takes in an array of example strings that will be converted into React html
// The 'x' button before the example should be clicked to remove that example from the list, then update
// The 'lock' checkbox should mark on to prevent that example from changing
function createExamples(eList) {
  let htmlExamples = '';
  for (var i=0; i < eList.length; i++) {
    htmlExamples += '<li /><button id=\'x\' class=\'x\'>×</button>' + eList[i] + '<input type=\'checkbox\' id=\'lock\' class=\'lock\'>';
  }
  return {__html: htmlExamples};
}

class LiveProgrammingView {
  // Required: Define an ordinary constructor to initialize your component.
  constructor(props, children) {
    // perform custom initialization here...
    // then call `etch.initialize`:
    etch.initialize(this)
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render() {
    return <div>
      <h2> Live Programming by Example</h2>
      <p>The program will dynamically add outputs based on your code. You are free to add, remove, or lock outputs to affect how the code will change.</p>
      <div dangerouslySetInnerHTML={createExamples([])} />
      <input id='input' type='text' placeholder='Add an output...'></input>
      <Button id='submit' class='submit'>Submit</Button>
    </div>
    // Create examples should be passed in a stored list of example strings
    // The Button should append the input text into the example list
    // However, this text should be checked to see if it is a valid output
    // This check shoudl also check to see if impossible logic is formed
  }

  // Required: Update the component with new properties and children.
  update (props, children) {
    // perform custom update logic here...
    // then call `etch.update`, which is async and returns a promise
    return etch.update(this)
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy () {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this)
    // then perform custom teardown logic here...
  }
}

export default LiveProgrammingView