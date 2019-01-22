'use babel';

//can i refactor this into an object?

export function getCode(pbeFile) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == pbeFile) {
      code = item.getText();
    }
  });
  return code;
};

export function setCode(pbeFile, code) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == pbeFile) {
      item.setText(code);
    }
  });
};

export function getExamples(pbeFile) {
  var ex = [];
  console.log("init")
  console.log(ex);
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle() == (pbeFile+".examples")) {
      var rawExamples = item.getText().trim();

      //TODO if a user uses the splitter char in the examples, parse error
      const splitter = "#@#"
      var exElems = rawExamples.replace(/=/g, splitter)
                               .replace(/\n/g,splitter)
                               .split(splitter);
      console.log(exElems.toString());
      var strEx = exElems.map(e => JSON.stringify(e.trim()));
      console.log("strEx")
      console.log(strEx)
      for (i = 0; i < strEx.length; i+=2) {
        console.log("strEx[i]");
        console.log(strEx[i]);
        console.log("strEx[i + 1]");
        console.log(strEx[i + 1]);
        ex[i / 2] = {call: strEx[i], res: strEx[i + 1], resType: typeof(exElems[i + 1])};
        console.log(strEx[i + 1]);
        console.log(ex)
      }
    }
  });
  console.log("Ex")
  console.log(ex)
  return ex;
};

export function setExamples(examples) {
  atom.workspace.getPaneItems().forEach(item => {
    if (item.getTitle().endsWith(".examples")) {
      var formattedExs = ""
      for (i=0; i<examples.length; i+=1){
        formattedExs += JSON.parse(examples[i].call)+" = "+JSON.parse(examples[i].res)+"\n";
      }
      //remove the extra  newline,
      formattedExs = formattedExs.slice(0,-1);
      item.setText(formattedExs);
    }
  });
};
