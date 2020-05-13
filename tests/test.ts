import {
    reverseLookup,
} from '../src/components/truthtable'
import { expect } from 'chai';
import 'mocha';

describe('basic checks', function() {
    it('not', function() {
      expect(reverseLookup(
        [
            [false],
            [true],
        ],
        [false, true],
        ['x']
      ).expressions[0]).to.equal('x')
    })

    it('not', function() {
      expect(reverseLookup(
        [
            [false],
            [true],
        ],
        [true, false],
        ['x']
      ).expressions[0]).to.equal('!x')
    })

  it('or', function() {
      expect(reverseLookup(
        [
            [true, true],
            [false, true],
            [false, false],
            [true, false],
        ],
        [true, true, false, true],
        ['x', 'y']
      ).expressions[0]).to.equal('x || y')

      expect(reverseLookup(
        [
            [true, true],
            [false, true],
            [false, false],
            [true, false],
        ],
        [true, true, true, false],
        ['x', 'y']
      ).expressions[0]).to.equal('!x || y')

      expect(reverseLookup(
        [
            [true, true, true],
            [false, true, true],
            [false, false, false],
            [true, false, true],
        ],
        [true, true, false, true],
        ['x', 'y', 'z']
      ).expressions[0]).to.equal('x || (y || z)')
  });
  it('and', function() {
      expect(reverseLookup(
        [
            [true, true],
            [false, true],
            [false, false],
            [true, false],
        ],
        [true, false, false, false],
        ['x', 'y']
      ).expressions[0]).to.equal('x && y')
    expect(reverseLookup(
        [
            [true, true, true],
            [false, true, true],
            [false, false, false],
            [true, false, true],
        ],
        [true, false, false, false],
        ['x', 'y', 'z']
      ).expressions[0]).to.equal('x && (y && z)')
  });
});
