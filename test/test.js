'use babel';

import {reeval} from '../lib/javascript/eval_pbe_helpers.js';
import {parseExamples} from '../lib/javascript/interface_helpers.js';

var assert = require('assert');

describe('Examples', function() {
  // /lib/javascript/eval_pbe_helpers.js
  describe('reeval', function() {
    it('should update examples res field', function() {
      var code = "function test(x, y) { return x + 1; }";
      var ex = [{ call: "test(1, 2)", res: '"hello"', resType: ""}];
      assert.equal(reeval(code, ex)[0].res, "2");
    });

    it('should update examples resType field', function() {
      var code = "function test(x, y) { return x + 1; }";
      var ex = [{ call: "test(1, 2)", res: '"hello"', resType: ""}];
      assert.equal(reeval(code, ex)[0].resType, "number");
    });

    it('should not change examples that are syntactically incorrect', function() {
      var code = "function test(x, y) { return x + 1; }";
      var ex = [{ call: "BAD CALL", res: '"hello"', resType: ""}];
      assert.equal(reeval(code, ex)[0], ex[0]);
    });

    it('should update correct examples, even if some examples are syntactically incorrect', function() {
      var code = "function test(x, y) { return x + 1; }";
      var ex = [{ call: "", res: 'undefined', resType: ""},
                { call: "test(1, 2)", res: '"hello"', resType: ""}];
      assert.equal(reeval(code, ex)[1].res, "2");
    });
  });

  // /lib/javascript/interface_helpers.js
  describe('parseExamples', function() {
    it('should parse out the function call', function() {
      var ex = "f(1, 2) = 2\n";
      assert.equal(parseExamples(ex)[0].call, "f(1, 2)");
    });

    it('should parse out the function result 1', function() {
      var ex = "f(1, 2) = 3\n";
      assert.equal(parseExamples(ex)[0].res, "3");
    });

    it('should parse out the function result 2', function() {
      var ex = 'f(1, 2) = "Hello"';
      assert.equal(parseExamples(ex)[0].res, '"Hello"');
    });

    it('should record the result type', function() {
      var ex = "f(1, 2, 5) = 4";
      assert.equal(parseExamples(ex)[0].resType, "number");
    });

    it('should default res to null if output not present', function() {
      var ex = "g(5, 6, 9, 'r') = ";
      assert.equal(parseExamples(ex)[0].res, "null");
    });

    it('should parse multiple lines', function() {
      var ex = "f(1, 2) = 4\n"
             + "g(4, 5) = \n"
             + "h(3) = 2";
      assert.equal(parseExamples(ex).length, 3);
    });
  });

});
