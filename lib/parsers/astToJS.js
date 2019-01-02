'use babel';


function astToJsStructure(ast){
  // terminal symbol
  if( typeof ast == "string") {
    return ast;
  }
  else if (ast.length == 1) {
    return ast[0];
  }
//  is the best way to do this just hard coding rules for each operation?
//  given that js is such a mess, might be...
//  else if (ast[0] == "str.at") {
//    return astToJsStructure(ast[1]) + "[" + astToJsStructure(ast[2]) + "]";
//  }
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
