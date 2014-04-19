'use strict';

var Promise = Promise || require('es6-promise').Promise,
    fromHash = require('./index.js'),
    expect = require('chai').expect,
    tree;

var delayed = function(timeout, value) {
    return new Promise(function(resolve) {
        setTimeout(function() { resolve(value); }, timeout);
    });
};

describe('promise-from-hash', function() {
    beforeEach(function() {
        tree = {
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
    });

    it('should return a promise', function() {
        expect(fromHash(tree)).to.have.property('then');
        expect(fromHash(tree).then).to.be.a('function');
    });

    it('should throw an error', function() {
        expect(fromHash).to.throw(Error);
        expect(fromHash.bind(this, '')).to.throw(Error);
        expect(fromHash.bind(this, null)).to.throw(Error);
        expect(fromHash.bind(this, [])).to.not.throw(Error);
        expect(fromHash.bind(this, {})).to.not.throw(Error);
    });

    it('should work for arrays', function(done) {
        fromHash([delayed(100, 1), delayed(50, 2), 3]).then(function(res) {
            expect(res).to.eql([1, 2, 3]);
            done();
        });
    });

    it('should work for hashes', function(done) {
        fromHash(tree).then(function(res) {
            expect(res).to.eql({
                a: 1,
                b: { b1: 2, b2: 3, bNull: null },
                c: 4,
                d: { d1: 'string', d2: { inner: 1} }
            });
            done();
        });
    });
});