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
You might also need to update the package dependencies

```
press ctrl+shift+p
type 'udup' to execute "Update Package Dependencies: Update"
press enter
```

You will also need a sygus solver installed. CVC4 is the easiest installation process. Download the binary, rename is 'cvc4', and add it to your path. This is an easy way to do that

```
wget http://cvc4.cs.stanford.edu/downloads/builds/x86_64-linux-opt/cvc4-1.6-x86_64-linux-opt
mv cvc4-1.6-x86_64-linux-opt cvc4
chmod u+x cvc4
mv cvc4 /usr/bin/
```

Use ctrl+shfit+F5 to reload package in Atom (sometimes need to press twice)


# Usage instructions

Open the .js file you want to use PBE repair. Turn on the package with ctrl+shift+e (or Packages > liveprogramming1 > Toggle).

Examples should be given in the form below in the .examples file. One example per line.

```
f("a b") = "a*b"
f("b a ") = "b*a*"
main("d","y") = "dy y"
```

This file is saved in the "./live" subdirectory, of the code's directory. For example ```tests/addition.js``` has examples in ```tests/.live/addition.js.examples```.  Atom will automatically open the proper file for you.

# Notes

Only string are supported at the moment.

It is really important to start the package with the correct file open. If you start the package with the wrong file, or you want to use the package with a different file, you need to refresh the atom editor (ctrl+shift+f5), then start the package again. This will be fixed when one of us learns to use the atom API.

# TODOs

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
- [x] basic white space formatting for example file
- [x] basic code repair
- [x] add support for .replace() and string indexing
- [x] new language for giving examples - only using json on the backend now

TODOS (sorted by difficulty):
- [ ] ability to turn off package
- [ ] only generate .sl files for target pbe code
- [ ] better example interface?
- [ ] add spinner icon when trying to synthesize something that takes a while
- [ ] allow synthesis to use component user-defined functions
- [ ] support types (only have strings at the moment). maybe this requires user-provided annotations? or can we use ```typeof``` on the examples provided?
- [ ] use existing function definition as basis for grammar of sygus initial repair attempt. if no solution is found, iteratively expand grammar.
- [ ] if we cannot find a solution for the function with new examples, or multiple examples have changed, we need a strategy to try multiple functions. One idea: First pick one function to try repairing. Then supply define-fxn in SYGUS format for the other fixed fxns so they can be used in synthesis of target function. Then try this for all functions. then pick best repair. Note, this approach still means only one function definition can be updated in a single synthesis step.

Long term TODOS:
- [ ] support Haskell
- [ ] repair to multiple functions at the same time. This entirely out-of-scope for sygus solvers.
