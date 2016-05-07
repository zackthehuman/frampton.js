import update from 'frampton-record/update';

QUnit.module('Frampton.Record.update');

QUnit.test('should return a copy of object with update key', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var newObj = update(obj, { one : 3 });

  ok(obj !== newObj);
  deepEqual({
    one : 3,
    two : 2,
    three : 3
  }, newObj);
});