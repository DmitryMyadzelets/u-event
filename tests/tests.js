/*jslint browser: false*/
'use strict';

const assert = function () {
    require('assert').apply(this, arguments);
    assert.cnt += 1;
};
assert.cnt = 0;

const ee = require('../index.js').emitter;

var a = ee();

assert(typeof a === 'object');

var passed;


// It try to emit without event handlers
passed = true;
try {
    a.emit('non-existent');
} catch (ignore) {
    passed = false;
}
assert(passed);


// It can set and emit an event with arguments
passed = false;
a.on('test', function (a, b) {
    assert(a === 'Bob');
    assert(b === 8);
    passed = true;
});
a.emit('test', 'Bob', 8);
assert(passed);


// It can set more then one handlers for one event
passed = 0;
a.on('inc', function () {
    passed += 1;
});
a.on('inc', function () {
    passed += 2;
});
a.emit('inc');
assert(passed === 3);


// It sets 'this' to the emitter itself
passed = false;
a.on('this', function () {
    passed = this === a;
});
a.emit('this');
assert(passed);


function Foo() {
    this.name = 'Foo';
}

Foo.prototype = {};
var p = ee(Foo.prototype);

var b = new Foo();
b.name = 'Bob';
var c = new Foo();
c.name = 'Cinti';

p.on('parent', function () {
    passed = true;
});

// It can set emitter to the prototype of the functional constuctor
passed = false;
b.emit('parent');
assert(passed);

passed = false;
c.emit('parent');
assert(passed);


p.on('b-child', function () {
    passed = this === b;
});
p.on('c-child', function () {
    passed = this === c;
});

passed = false;
b.emit('b-child');
assert(passed);

passed = false;
b.emit('c-child');
assert(!passed);

passed = false;
c.emit('c-child');
assert(passed);

passed = false;
c.emit('b-child');
assert(!passed);


// It can't set an event for non-emitter. Throws an error.
passed = false;
try {
    c.on('c-only', function () {
        passed = true;
    });
} catch (ignore) {
    passed = true;
}
assert(passed);

passed = false;
b.emit('c-only');
assert(!passed);

passed = false;
p.on('both', function (ok) {
    passed = ok;
});

b.emit('both', true);
assert(passed);

b.emit('both', 8);
assert(8 === passed);

c.emit('both', 7);
assert(7 === passed);


// It losts parent events if the child set as an emitter
passed = false;
c.emit('both', true);
assert(passed);

ee(c);

passed = false;
c.emit('both', true);
assert(!passed);


// It requres a function as an event handler
passed = false;
try {
    c.on('foo');
} catch (ignore) {
    passed = true;
}
assert(passed);

// It allows chainig, returning itself
assert(c === c.on('foo', function () {
    return;
}));


console.log('Tests passed: ', assert.cnt);