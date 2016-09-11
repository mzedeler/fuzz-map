const assert = require('chai').assert;

describe('Fuzz map', () => {
  describe('Initialization', () => {
    it('Is possible to load the module', () => {
      assert(require('.'));
      assert.isFunction(require('.'));
    });
    it('Is possible to initialize an empty fuzz map', () => {
      const FuzzMap = require('.');
      const fm = FuzzMap({});
      assert.isFunction(fm);
      assert.isNull(fm('nonexistent'));
    });
  });
  describe('Lookup', () => {
    it('Is possible to use a fuzz map with objects and arrays', () => {
      const FuzzMap = require('.');
      const fm = FuzzMap({
        array1: [
          '1-one',
          '1-two'
        ],
        array2: [
          '2-one',
          '2-two'
        ],
        obj1: {
          title: 'Some title'
        }
      });
      assert.isFunction(fm, 'It is initialized');
      assert.isNull(fm('nonexistent'), 'It returns null for non-existing keys');
      assert.isFunction(fm('array1'), 'It returns a function for array leaves');
      assert.isFunction(fm('obj1'), 'It returns a function for object leaves');
      assert.equal(fm('obj1')('title'), 'Some title', 'It can do crisp object attribute lookups');
      assert.equal(fm('array1')('1-one'), '1-one', 'It can do crisp array lookups');
    });
    it('Is possible to do fuzzy lookups', () => {
      const FuzzMap = require('.');
      const fm = FuzzMap({
        'abcdef': 'ok1',
        '0123456': 'ok2',
        '0123456789xy': 'ok3' 
      });
      assert.isNull(fm('abcde'), 'Beyond six letter threshold requires crisp match');
      assert.equal(fm('ABCDEF'), 'ok1', 'Case insensitive match');
      assert.equal(fm('abcdefG'), 'ok1', 'Superfluous letter within boundary');
      assert.isNull(fm('abcdefGH'), 'Two superfluous letters outside boundary');
      assert.equal(fm('012345A'), 'ok2', 'Moving replacing letter within boundary');
      assert.equal(fm('0123456789xy'), 'ok3');
      assert.equal(fm('0123456789AA'), 'ok3', 'Replacing two letters in a 12 letter string is within boundary');
      assert.isNull(fm('012345678AAA'), 'Replacing two letters in a 12 letter string is outside boundary');
    });
    it('Is possible to embed other lookup functions', () => {
      const FuzzMap = require('.');
      const fm = FuzzMap({
        'func': key => `<${key}>` 
      });
      assert.isFunction(fm('func'));
      assert.equal(fm('func')('some key'), '<some key>');
    });
  });
});
