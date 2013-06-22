"use strict";
var assert = require('assert')
  , InlineCompiler = require('../lib/inline');

describe('InlineCompiler', function() {

  describe('with default configuration', function() {

    var c = new InlineCompiler();

    it('should emit generic chars as is', function() {
      assert.equal(c.compile("Hello world!"), "Hello world!");
    });

    it('should emit backslashed special chars as is', function() {
      assert.equal(c.compile("\\\\"), "\\");
      assert.equal(c.compile("Test\\."), "Test.");
      assert.equal(c.compile("\\Test\\."), "\\Test.");
    });

    it('should escape &amp;, except in entity references', function() {
      assert.equal(c.compile("this & that"), "this &amp; that");
      assert.equal(c.compile("this &amp; that"), "this &amp; that");
      assert.equal(c.compile("this &#026; that"), "this &#026; that");
      assert.equal(c.compile("this &#X1A; that"), "this &#X1A; that");
      // a bit more complicated
      var input = "This & that; A&B, but leave &amp;, &#095; and &#x09a; alone.";
      var output = "This &amp; that; A&amp;B, but leave &amp;, &#095; and &#x09a; alone.";
      assert.equal(c.compile(input), output);
    });

    it('should escape &lt;, except in HTML tags', function() {
      assert.equal(c.compile("a < b"), "a &lt; b");
      assert.equal(c.compile("a <b>c</b>"), "a <b>c</b>");
    });

    it('should leave HTML comments unprocessed', function() {
      var input = "This & <!-- this text is *unprocessed* --> that.";
      var output = "This &amp; <!-- this text is *unprocessed* --> that.";
      assert.equal(c.compile(input), output);
    });

    it('should escape &gt; chars', function() {
      var input = "A < B; B > C";
      var output = "A &lt; B; B &gt; C";
      assert.equal(c.compile(input), output);
    });

  });


});
