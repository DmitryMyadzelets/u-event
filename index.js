/* jslint browser: false */
'use strict'

function on (event, fun) {
  if (!this.hasOwnProperty('events')) {
    throw new Error('Can\'t set event. Call emitter(object) first.')
  }
  if (typeof fun !== 'function') {
    throw new Error('Event handler should be a function')
  }
  if (this.events[event]) {
    this.events[event].push(fun)
  } else {
    this.events[event] = [fun]
  }
  return this
}

function emit (event, o) {
  if (this.events[event]) {
    var i
    var m = this.events[event].length | 0
    for (i = 0; i < m; i += 1) {
      if (arguments.length === 2) {
        this.events[event][i].call(this, o)
      } else {
        this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    }
  }
}

module.exports = function (o) {
  o = o || {}
  o.on = on
  o.emit = emit
  o.events = {}
  return o
}

module.exports.emitter = module.exports
