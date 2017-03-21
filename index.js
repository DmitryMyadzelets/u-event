/*jslint browser: false*/
'use strict';

function on(event, fun) {
    if (!this.hasOwnProperty('events')) {
        throw new Error('Can\'t set event. Call emitter(object) first.');
    }
    if ('function' !== typeof fun) {
        throw new Error('Event handler should be a function');
    }
    this.events = this.events || {};
    this.events[event] = this.events[event] || [];
    this.events[event].push(fun);
    return this;
}

function emit(event, a, b) {
    if (this.events && this.events[event]) {
        var i, m = this.events[event].length | 0;
        for (i = 0; i < m; i += 1) {
            switch (arguments.length) {
            case 1:
                this.events[event][i].call(this);
                break;
            case 2:
                this.events[event][i].call(this, a);
                break;
            case 3:
                this.events[event][i].call(this, a, b);
                break;
            default:
                this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
}

exports.emitter = function (o) {
    o = o || {};
    o.on = on;
    o.emit = emit;
    o.events = {};
    return o;
};