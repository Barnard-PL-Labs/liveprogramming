/** @jsx etch.dom */

const etch = require('etch')

function createTitle() {
  const title = '<h2> Live Programming by Example</h2>';
  const body = '<p>The program will dynamically add outputs based on your code. You are free to add, remove, or lock outputs to affect how the code will change.</p>';
  return {__html: title + body};
}

function createExamples(eList) {
  let htmlExamples = '';
  for (var i=0; i < eList.length; i++) {
    htmlExamples += '<li>' + eList[i] + '</li>';
  }
  return {__html: htmlExamples};
}

function createInput() {
  const input = '<input id=\'input\' type=text placeholder=\'Add an output...\'>';
  const button = '<button id=\'submit\' class=\'submit\'>Submit</button>';
  return {__html: input + button};
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
    return <div dangerouslySetInnerHTML={{__html: props.content} />;
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