
var jsToSygus = function jsToSygus(code) {
  var sygusAst = jsToSygusAST(code);

  //var sygusCode = astToSygus(sygusAst);
  return "";//sygusCode
};

function jsToAST(code) {
  var esprima = require('esprima');
  code = code.replace(/return /g,'');
  var ast = esprima.parseScript(code);
  var expr = ast.body[0].body[0].expression;
  console.log(expr);
  console.log(jsExprToAST(expr));
}

function jsExprToAST(expr) {
  if (expr.type == "BinaryExpression") {
    if (expr.operator == "+") {
      return [jsExprToAST(expr.left),
              "str.++", //TODO what if this is int.+?
              jsExprToAST(expr.right)];
    }
  }
  else if (expr.type == "Identifier") {
    return expr.name;
  }
  else if (expr.type == "Literal") {
    return expr.raw;
  }
}

module.exports = jsToSygus
