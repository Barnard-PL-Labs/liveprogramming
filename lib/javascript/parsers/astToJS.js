'use babel';


//  is the best way to do this just hard coding rules for each operation?
//  given that js is such a mess, might be...
function astToJsStructure(ast){
  // terminal symbol
  if( typeof ast == "string" || typeof ast == "number") {
    return ast;
  }
  else if (ast.length == 1) {
    return ast[0];
  }
  else if (ast[0] == "str.at") {
    return astToJsStructure(ast[1]) + "[" + astToJsStructure(ast[2]) + "]";
  }
  else if (ast[0] == "str.++" || ast[0] == "+") {
    return astToJsStructure(ast[1]) + " + " + astToJsStructure(ast[2]);
  }
  else if (ast[0] == "str.substr") {
    return astToJsStructure(ast[1]) +
           ".substring(" + astToJsStructure(ast[2]) + " , " + astToJsStructure(ast[3]) + "+1)";
  }
  else if (ast[0] == "str.len") {
    return astToJsStructure(ast[1]) +
           ".length";
  }
  else if (ast[0] == "-") {
    return astToJsStructure(ast[1]) + " - " + astToJsStructure(ast[2]);
  }
  else if (ast[0] == "*") {
      return astToJsStructure(ast[1]) + " * " + astToJsStructure(ast[2]);
  }
  else if (ast[0] == "str.replace") {
    return astToJsStructure(ast[1]) +
           ".replace(" +
           astToJsStructure(ast[2]) +
           ", " +
           astToJsStructure(ast[3]) +
           ")";
  }
  else if (ast[0] == "str.prefixof") {
    return astToJsStructure(ast[2]) +
           ".includes(" +  astToJsStructure(ast[1]) + ")" + " && " + astToJsStructure(ast[1]) +
                  ".includes(" + astToJsStructure(ast[2]) + "[0])";
  }
  else if (ast[0] == "str.suffixof") {
    return astToJsStructure(ast[2]) +
           ".includes(" +  astToJsStructure(ast[1]) + ")" + " && " + astToJsStructure(ast[1]) +
                  ".includes(" + astToJsStructure(ast[2]) + "["+ astToJsStructure(ast[2]) + ".length-1])";
  }
  else {
    console.error("Unhandled AST form: "+ast+" : "+(typeof ast));
  }
};

export function astToJs(ast) {
  return "  return " + astToJsStructure(ast) + ";";
};
