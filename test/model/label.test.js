const Label = require('../../src/model/label');

describe('Label', () => {
  let label;

  beforeEach(() => {
    label = new Label({
      name: 'bug',
      description: 'broken things',
      color: 'FF0000',
      replaces: ['fault', 'broken'],
    });
  });

  describe('constructor', () => {
    it('can handle minimal data', () => {
      const label = new Label({ name: 'foo' });
      expect(label.description).toEqual('');
      expect(label.color).toEqual('');
      expect(label.replaces).toEqual([]);
    });
  });

  describe('shouldReplace', () => {
    it('identifies a label that should be replaced', () => {
      const newLabel = new Label({
        name: 'fault',
      });

      expect(label.shouldReplace(newLabel)).toBe(true);
    });

    it('identifies a label that should not be replaced', () => {
      const newLabel = new Label({
        name: 'feature',
      });

      expect(label.shouldReplace(newLabel)).toBe(false);
    });

    it('marks label with same name as to be replaced', () => {
      const newLabel = new Label({
        name: 'bug',
      });

      expect(label.shouldReplace(newLabel)).toBe(true);
    });
  });

  describe('hash', () => {
    it('generates a string hash', () => {
      expect(typeof label.hash()).toBe('string');
    });

    it('returns the same hash for equal objects', () => {
      expect(label.hash()).toEqual(label.hash());
    });

    it('returns different hashes for different objects', () => {
      const otherLabel = new Label({
        name: 'bug',
        description: 'other broken things',
        color: '110000',
        replaces: ['fault', 'broken'],
      });

      expect(label.hash()).not.toEqual(otherLabel.hash());
    });
  });
});
