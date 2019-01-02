'use babel';


function astToJsStructure(ast){
  // terminal symbol
  if( typeof ast == "string") {
    return ast;
  }
  else if (ast.length == 1) {
    return ast[0];
  }
  // binary op
  else if (ast.length == 3) {
    return astToJsStructure(ast[1]) + " " + ast[0] + " " + astToJsStructure(ast[2]);
  }
  else {
    console.error("Unhandled AST form: "+ast+" : "+(typeof ast));
  }
};

export function astToJs(ast) {
  return "  return " + astToJsStructure(ast) + ";";
};
