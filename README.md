## Promise.all for hash

### Quick example

```js
// function that returns a promise
var delayed = function(timeout, value) {
    return new Promise(function(resolve) {
        setTimeout(function() { resolve(value); }, timeout);
    });
};

// hash that contains promises (and nested promises)
var tree = {
    a: 1,
    b: delayed(100, {
        b1: delayed(200, 2),
        b2: delayed(300, delayed(50, 3)),
        bNull: delayed(40, null)
    }),
    c: delayed(400, 4),
    d: {
        d1: delayed(500, 'string'),
        d2: delayed(300, { inner: 1 })
    }
};



var fromHash = require('promise-from-hash');

fromHash(tree).then(function(result) {
  /* 
    result will be equal 
    {
        a: 1,
        b: { b1: 2, b2: 3, bNull: null },
        c: 4,
        d: { d1: 'string', d2: { inner: 1} }
    }
  */
});

```
