const leven = require('leven');

function fuzz(obj, threshold) {
  threshold = threshold || 0.17;
  function wrap(value) {
    if(value instanceof Object) {
      const result = fuzz(value);
      result.obj = value;
      return result;
    } else {
      return value;
    }
  }
  function result(key, thresholdOverride, debug) {
    if(obj[key] !== undefined) {
      return wrap(obj[key]);
    } else {
      if(obj instanceof Array) {
        const arrayCandidate = obj
          .map(target => [leven(key.toLowerCase(), target.toLowerCase())/key.length, target])
          .sort((a, b) => {return a[0] < b[0] ? -1 : 1})[0];
        return arrayCandidate[0] < (thresholdOverride || threshold) ? arrayCandidate[1] : undefined;
      } else if(obj instanceof Function) {
        return wrap(obj(key));
      } else {
        if(debug) {
          console.log('DEBUG');
          console.log(Object
          .keys(obj)
          .map(target => [leven(key.toLowerCase(), target.toLowerCase())/key.length, target])
          .sort((a, b) => {return a[0] < b[0] ? -1 : 1}));
          console.log(Object
              .keys(obj)
              .map(target => [leven(key.toLowerCase(), target.toLowerCase())/key.length, target])
              .sort((a, b) => {return a[0] < b[0] ? -1 : 1})[0]);
        }
        const objCandidate = Object
          .keys(obj)
          .map(target => [leven(key.toLowerCase(), target.toLowerCase())/key.length, target])
          .sort((a, b) => {return a[0] < b[0] ? -1 : 1})[0];
        if(debug) {
          console.log('DEBUG: objCandidate:');
          console.log(objCandidate);
        }
        if(objCandidate && objCandidate[0] < (thresholdOverride || threshold)) {
          if(debug) {
            console.log('Returning ' + objCandidate[1]);
            console.log(obj[objCandidate[1]]);
          }
          return wrap(obj[objCandidate[1]]);
        } else {
          return null;
        }
      }
    }
  }
  return result;
}

module.exports = fuzz;
