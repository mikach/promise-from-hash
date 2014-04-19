'use strict';

var Promise = Promise || require('es6-promise').Promise;

var isArray = function(arr) {
    return Array.isArray(arr);
};

var isObject = function(obj) {
    return obj === Object(obj);
};

var isSimple = function(obj) {
    return !isArray(obj) && !isObject(obj);
};

var isPromise = function(obj) {
    return obj && typeof obj.then === 'function';
};

var makePromise = function(node, key) {
    return new Promise(function(resolve) {
        node[key].then(function(result) {
            node[key] = result;
            if (isSimple(result)) {
                resolve(result);
            } else {
                fromHash(result).then(resolve);
            }
        });
    });
};

var fromHash = function(hash) { 
    if (isSimple(hash)) throw new Error(hash + ' is not an object');

    var promises = Object.keys(hash).map(function(key) {
        if (isPromise(hash[key])) return makePromise(hash, key);
        if (!isSimple(hash[key])) return fromHash(hash[key]);
        return hash[key];
    });

    return new Promise(function(resolve) { 
        Promise.all(promises).then(function() {
            resolve(hash);
        });
    });
};

module.exports = fromHash;