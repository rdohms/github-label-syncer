const Label = require('../../src/model/label');
const labels = require('../../src/model/labels');

describe('labels', () => {
  let sampleLabels;

  beforeEach(() => {
    sampleLabels = [{ name: 'bug' }, { name: 'feature' }];
  });

  describe('build', () => {
    it('converts input to Labels', () => {
      expect(labels.build(sampleLabels)).toEqual([
        new Label({
          name: 'bug',
        }),
        new Label({
          name: 'feature',
        }),
      ]);
    });
  });

  describe('compare', () => {
    let existing;
    let incoming;
    let operations;

    beforeEach(() => {
      existing = labels.build([
        {
          name: 'fault',
          color: '000000',
        },
        {
          name: 'feature',
          color: '110000',
        },
        {
          name: 'wip',
        },
        {
          name: 'refactoring',
        },
        {
          name: 'reworking',
        },
      ]);

      incoming = labels.build([
        {
          name: 'bug',
          color: '000000',
          replaces: ['fault'],
        },
        {
          name: 'feature',
          color: '220000',
        },
        {
          name: 'refactoring',
          replaces: ['reworking'],
        },
        {
          name: 'CI',
        },
      ]);

      operations = labels.compare(existing, incoming);
    });

    it('correctly identifies labels to update', () => {
      expect(operations.replace).toEqual([
        {
          newLabel: new Label({
            name: 'bug',
            color: '000000',
            replaces: ['fault'],
          }),
          oldLabel: new Label({
            name: 'fault',
            color: '000000',
          }),
        },
        {
          newLabel: new Label({
            name: 'feature',
            color: '220000',
          }),
          oldLabel: new Label({
            name: 'feature',
            color: '110000',
          }),
        },
      ]);
    });

    it('correctly identifies labels to delete', () => {
      expect(operations.delete).toEqual([
        new Label({
          name: 'wip',
        }),
        new Label({
          name: 'reworking',
        }),
      ]);
    });

    it('correctly identifies labels to create', () => {
      expect(operations.create).toEqual([
        new Label({
          name: 'CI',
        }),
      ]);
    });
  });
});
