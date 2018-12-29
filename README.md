# Live programming

Trying to make something like the video below in atom

https://www.youtube.com/watch?v=tKmx2myzFEU

# Install instructions

```
git clone https://github.com/Jack-Huang1/liveprogramming
cd liveprogramming
apm link
```
Use ctrl+shfit+F5 to reload package in Atom (sometimes need to press twice)

Examples should be given as:

```
f(1,2) = 5
f(2,3) = 6
```

progress:
- [x] can read and evaluate basic functions from current file window (i.e., addition.js)
- [x] open workspace panel as an editable window for user inputs
- [x] reevaluates code on code (onDidChange)
- [x] multiple input/output examples for single function
- [x] reevaluate code on example change (cannot be done until we have TextEditor)
- [x] provide examples for multiple functions
- [x] allow for arbitrary number of examples

TODOS (sorted by difficulty):
- [ ] allow for deleting examples
- [ ] save input examples in a temp file (associated with code file) and load when we pull up that code file
- [ ] synthesize code


Long term TODOS:
- [ ] support Haskell
- [ ] only rerun/update output examples on syntactically correct code (for .js is the same as running the code?)
