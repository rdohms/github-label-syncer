const LabelSyncer = require('../src/label-syncer');
const Label = require('../src/model/label');
jest.mock('../src/client/labels-api');

describe('LabelSyncer', () => {
  describe('sync', () => {
    it('executes and returns operations', async () => {
      const opts = { dryRun: false };
      const syncer = new LabelSyncer(opts);

      syncer.api.getLabels.mockReturnValue([
        new Label({ name: 'ci' }),
        new Label({ name: 'enhancement' }),
      ]);

      const operations = await syncer.sync([
        new Label({ name: 'bug' }),
        new Label({ name: 'feature', replaces: ['enhancement'] }),
      ]);

      expect(operations).toEqual({
        create: [new Label({ name: 'bug' })],
        delete: [new Label({ name: 'ci' })],
        replace: [
          {
            newLabel: new Label({ name: 'feature', replaces: ['enhancement'] }),
            oldLabel: new Label({ name: 'enhancement' }),
          },
        ],
      });

      expect(syncer.api.getLabels).toHaveBeenCalled();
      expect(syncer.api.update).toHaveBeenCalledWith(operations.replace);
      expect(syncer.api.create).toHaveBeenCalledWith(operations.create);
      expect(syncer.api.delete).toHaveBeenCalledWith(operations.delete);
    });

    it('throws errors on operation failures', async () => {
      const opts = { dryRun: false };
      const syncer = new LabelSyncer(opts);

      syncer.api.getLabels.mockReturnValue([]);
      syncer.api.update.mockReturnValue(Promise.reject({ error: 1 }));

      try {
        await syncer.sync([]);
      } catch (e) {
        expect(e).toEqual({ error: 1 });
      }
    });

    it('throws error on failures to get labels', async () => {
      const opts = { dryRun: false };
      const syncer = new LabelSyncer(opts);

      syncer.api.getLabels.mockReturnValue(Promise.reject({ error: 1 }));

      try {
        await syncer.sync([]);
      } catch (e) {
        expect(e).toEqual({ error: 1 });
        expect(syncer.api.update).not.toHaveBeenCalled();
      }
    });

    it('does not execute anything when set to DryRun', async () => {
      const opts = { dryRun: true };
      const syncer = new LabelSyncer(opts);

      syncer.api.getLabels.mockReturnValue([new Label({ name: 'ci' })]);

      const operations = await syncer.sync([new Label({ name: 'feature' })]);

      expect(operations).toEqual({
        create: [new Label({ name: 'feature' })],
        delete: [new Label({ name: 'ci' })],
        replace: [],
      });

      expect(syncer.api.update).not.toHaveBeenCalled();
      expect(syncer.api.create).not.toHaveBeenCalled();
      expect(syncer.api.delete).not.toHaveBeenCalled();
    });
  });
});
