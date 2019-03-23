export default class LiveProgramming1View {

    constructor(serializedState) {
      // Create root element
      this.element = document.createElement('div');
      this.element.classList.add('main');
  
      // Create title element
      const title = document.createElement('div');
      title.textContent = 'Live Programming by Example';
      title.classList.add('title');
      this.element.appendChild(title);

      // Create element of the list of example outputs
      const exampleList = document.createElement('div');
      exampleList.tagId = 'ul';
      exampleList.classList.add('list')
      this.element.appendChild(exampleList);

      // Create the input box to add an example
      const exampleInput = document.createElement('div');
      exampleInput.tagName = 'input';
      exampleInput.hasAttribute('type') = true;
      exampleInput.getAttribute('type') = 'text';
      this.element.appendChild(exampleInput);
    }
  
    // Returns an object that can be retrieved when package is activated
    serialize() {}
  
    // Tear down any state and detach
    destroy() {
      this.element.remove();
    }
  
    getElement() {
      return this.element;
    }
  
  }