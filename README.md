
# fuzz-map

Fuzzy lookup in deep data structures

![build status](https://travis-ci.org/mzedeler/fuzz-map.svg?branch=master)

## Usage

FuzzMap is a tool that does fuzzy lookup in data structures, returning whatever matches best.

    const FuzzMap = require('fuzz-map');
    
    const fm = FuzzMap({
      'The quick brown fox': {
        'jumped over the brown': 'fence'
      }
    });
    
    console.log(fm('the quijk brown fox')('jmped over the brown'));
    // Output:
    // fence

### Array membership lookup

Fuzzmap also tries to match strings in arrays, returning the best match:

    const FuzzMap = require('fuzz-map');

    const fm = FuzzMap({
      array: [
        'over the brown fence'
      ]
    });

    console.log(fm('array')('over the brown fense'));
    // Output:
    /// over the brown fence


### Embedded custom lookup functions

Any function found will be treated as a lookup function with fuzzy matching applied:

    const FuzzMap = require('.');

    const fm = FuzzMap({
      deep: string => ({
        one: `one ${string}`,
        two: `two ${string}`
      })
    });

    console.log(fm('deep')('quick brown fox')('one'));
    // Output:
    // one quick brown fox


### Adjusting the match tolerance

FuzzMap uses the inverse Levensthein distance for matching with a default of 0.17
allowing a little more than one typing error per six characters. This can be adjusted
on each lookup:

    const FuzzMap = require('.');

    const fm = FuzzMap({
      'The quick brown fox': {
        'jumped over the brown': 'fence'
      }
    });

    try {
      console.log(fm('te qik brwn fx')('jmpd ovr te brwn'));
    } catch(e) {
      console.log('Error: nothing found');
    }
    // Output:
    // Error: nothing found

    console.log(fm('te qik brwn fx', 0.5)('jmpd ovr te brwn', 0.5));
    // Output:
    // fence

Setting the tolerance to 0 means no errors are allowed. Setting it to 1 means that everything
will match (but the best match will always be returned).


### Inspecting intermediate results

The result from a lookup *always* has the resulting underlying data structure available in the property `obj`.

This makes it possible to inspect the intermediate results:

    const FuzzMap = require('fuzz-map');

    const fm = FuzzMap({
      'The quick brown fox': {
        'jumped over the brown': 'fence'
      }
    });

    console.log(fm('deep')('quick brown fox').obj);
    // Output:
    // { one: 'one quick brown fox', two: 'two quick brown fox' }

This also applies to vanilla data structures (without a custom function call as in the example above).


## Bugs

If you find a bug, please report it at https://github.com/mzedeler/fuzz-map/issues

If possible, submit a failing test as well and if you want to be really nice, provide a patch as well.

## Copyright

Everything here is copyright by Michael Zedeler <michael@zedeler.dk>. See the accompanying LICENSE file.
