# Live programming

Trying to make something like the video below in atom

https://www.youtube.com/watch?v=tKmx2myzFEU

# Install instructions

first install atom, then:

```
git clone https://github.com/Jack-Huang1/liveprogramming
cd liveprogramming
apm link
```

Use ctrl+shfit+F5 to reload package in Atom (sometimes need to press twice)

Examples should be given as a json file:

```
["main(2,4)",8,"f(3)",5]
```

This file is saved in the same directory as the code on which it runs. for example ```tests/addition.js``` has examples in ```tests/addition.js.examples```.

progress:
- [x] can read and evaluate basic functions from current file window (i.e., addition.js)
- [x] open workspace panel as an editable window for user inputs
- [x] reevaluates code on code (onDidChange)
- [x] multiple input/output examples for single function
- [x] reevaluate code on example change (cannot be done until we have TextEditor)
- [x] provide examples for multiple functions
- [x] allow for arbitrary number of examples
- [x] allow for deleting examples
- [x] save input examples in a temp file (associated with code file) and load when we pull up that code file
- [x] only rerun/update output examples on syntactically correct code (for .js, this means catching syntax errors at runtime)

TODOS (sorted by difficulty):
- [ ] synthesize/repair code
- [ ] ability to turn off package
- [ ] preserve white space in example file
- [ ] richer json format for examples?
- [ ] better example interface?


Long term TODOS:
- [ ] support Haskell
