import divide from 'frampton-math/divide';

QUnit.module('Frampton.Math.divide');

QUnit.test('divides two numbers', function(assert) {
  const actual = divide(4, 2);
  const expected = 2;
  assert.equal(actual, expected);
});
