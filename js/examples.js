const FuzzMap = require('.');

const fm = FuzzMap({
  'The quick brown fox': {
    'jumped over the brown': 'fence'
  },
  array: [
    'over the brown fence'
  ],
  deep: string => ({
    one: `one ${string}`,
    two: `two ${string}`
  })
});

// Deep fuzzy lookups (note the spelling errors)
console.log(fm('the quijk brown fox')('jmped over the brown'));
// Output:
// fence


// Array member lookups
console.log(fm('array')('over the brown fense'));
// Output:
/// over the brown fence


// Embedded custom lookup functions
console.log(fm('deep')('quick brown fox')('one'));
// Output:
// one quick brown fox


// Inspecting intermediate data structures
console.log(fm('deep')('quick brown fox').obj);
// Output:
// { one: 'one quick brown fox', two: 'two quick brown fox' }


// Adjusting the spelling tolerance
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
