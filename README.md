# Event emitter micro helper

    npm install u-event

## Standalone emitter
```javascript
    var ee = require('u-event').emitter();
    ee.on('test', function () {
        console.log('passed');
    })
    ee.emit('test'); // passed
```

## Any object as an emitter
Note, it creates `events` property for the object.

```javascript
    var o = {
        name: 'Alice'
    };
    require('u-event').emitter(o);
    o.on('who', function () {
        console.log(this.name);
    });
    o.emit('who'); // Alice
```
## Extend object's prototype

```javascript
    function Foo(name, age) {
        this.name = name;
        this.age = age;
    }
    Foo.prototype.who = function () {
        console.log(this.name);
    };
    a = new Foo('Alice', 21);
    b = new Foo('Bob', 28);
    require('u-event').emitter(Foo.prototype)
        .on('who', function () {
            this.who();
        })
        .on('age', function () {
            console.log(this.age);
        });
    a.emit('who'); // Alice
    b.emit('who'); // Bob
    a.emit('age'); // 21
    b.emit('age'); // 28
```