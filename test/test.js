'use babel';

import {parseExamples} from '../lib/javascript/interface_helpers.js';

var assert = require('assert');

describe('Examples', function() {
  describe('parseExamples', function() {
    it('should parse out the function call', function() {
      var ex = "f(1, 2) = 2\n"
      assert.equal(parseExamples(ex)[0].call, "f(1, 2)");
    });

    it('should parse out the function result 1', function() {
      var ex = "f(1, 2) = 3\n"
      assert.equal(parseExamples(ex)[0].res, "3");
    });

    it('should parse out the function result 2', function() {
      var ex = 'f(1, 2) = "Hello"'
      assert.equal(parseExamples(ex)[0].res, '"Hello"');
    });

    it('should record the result type', function() {
      var ex = "f(1, 2, 5) = 4"
      assert.equal(parseExamples(ex)[0].resType, "number");
    });

    it('should default res to null if output not present', function() {
      var ex = "g(5, 6, 9, 'r') = "
      assert.equal(parseExamples(ex)[0].res, "null");
    });

    it('should parse multiple lines', function() {
      var ex = "f(1, 2) = 4\n"
             + "g(4, 5) = \n"
             + "h(3) = 2"
      assert.equal(parseExamples(ex).length, 3);
    });

  });
});
