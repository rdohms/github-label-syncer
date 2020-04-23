const LabelsApi = require('../../src/client/labels-api');
const labels = require('../../src/model/labels');

describe('LabelsApi', () => {
  let api;
  let ghMock;
  let options;

  beforeAll(() => {
    ghMock = {
      authenticate: jest.fn().mockReturnValue(true),
      issues: {
        listLabelsForRepo: {
          endpoint: {
            merge: jest.fn().mockReturnValue({}),
          },
        },
        updateLabel: jest.fn(),
        createLabel: jest.fn(),
        deleteLabel: jest.fn(),
      },
    };
  });

  beforeEach(() => {
    options = {
      githubConstructor: () => ghMock,
      owner: 'rdohms',
      repo: 'Test',
    };
    api = new LabelsApi(options);
  });

  describe('getLabels', () => {
    it('returns labels', async () => {
      const rawLabels = [{ name: 'bar' }, { name: 'boz' }];
      ghMock.paginate = jest.fn().mockReturnValue(Promise.resolve(rawLabels));

      const expectedLabels = labels.build(rawLabels);
      const existingLabels = await api.getLabels();
      expect(existingLabels).toEqual(expectedLabels);

      expect(
        ghMock.issues.listLabelsForRepo.endpoint.merge
      ).toHaveBeenCalledWith({
        owner: 'rdohms',
        repo: 'Test',
      });
    });

    it('throws errors as expected', async () => {
      ghMock.paginate = jest.fn().mockReturnValue(Promise.reject({}));

      try {
        await api.getLabels();
      } catch (e) {
        expect(e).toEqual({});
        expect(
          ghMock.issues.listLabelsForRepo.endpoint.merge
        ).toHaveBeenCalledWith({
          owner: 'rdohms',
          repo: 'Test',
        });
      }
    });
  });

  describe('update', () => {
    it('updates each label correctly', (done) => {
      ghMock.issues.updateLabel.mockReturnValue({ success: true });
      const operations = [
        {
          oldLabel: { name: 'foo' },
          newLabel: { name: 'bar', color: 'FF0000', description: 'buzz' },
        },
        {
          oldLabel: { name: 'faa' },
          newLabel: { name: 'bor', color: 'FF0000', description: 'bezz' },
        },
      ];

      api
        .update(operations)
        .then(() => {
          expect(ghMock.issues.updateLabel).toHaveBeenNthCalledWith(1, {
            owner: 'rdohms',
            repo: 'Test',
            current_name: operations[0].oldLabel.name,
            name: operations[0].newLabel.name,
            color: operations[0].newLabel.color,
            description: operations[0].newLabel.description,
          });
          expect(ghMock.issues.updateLabel).toHaveBeenNthCalledWith(2, {
            owner: 'rdohms',
            repo: 'Test',
            current_name: operations[1].oldLabel.name,
            name: operations[1].newLabel.name,
            color: operations[1].newLabel.color,
            description: operations[1].newLabel.description,
          });
          done();
        })
        .catch(done.fail);
    });
  });

  describe('create', () => {
    it('creates all labels passed to it', (done) => {
      const incomingLabels = [
        {
          name: 'foo',
          color: '00FF00',
          description: 'buzz',
        },
        {
          name: 'baa',
          color: '00FF00',
          description: 'bazz',
        },
      ];

      api
        .create(incomingLabels)
        .then(() => {
          expect(ghMock.issues.createLabel).toHaveBeenNthCalledWith(1, {
            owner: 'rdohms',
            repo: 'Test',
            name: incomingLabels[0].name,
            color: incomingLabels[0].color,
            description: incomingLabels[0].description,
          });
          expect(ghMock.issues.createLabel).toHaveBeenNthCalledWith(2, {
            owner: 'rdohms',
            repo: 'Test',
            name: incomingLabels[1].name,
            color: incomingLabels[1].color,
            description: incomingLabels[1].description,
          });
          done();
        })
        .catch(done.fail);
    });
  });

  describe('delete', () => {
    it('deletes all labels passed to it', (done) => {
      const labelsToDelete = [
        {
          name: 'foo',
        },
        {
          name: 'baa',
        },
      ];

      api
        .delete(labelsToDelete)
        .then(() => {
          expect(ghMock.issues.deleteLabel).toHaveBeenNthCalledWith(1, {
            owner: 'rdohms',
            repo: 'Test',
            name: labelsToDelete[0].name,
          });
          expect(ghMock.issues.deleteLabel).toHaveBeenNthCalledWith(2, {
            owner: 'rdohms',
            repo: 'Test',
            name: labelsToDelete[1].name,
          });
          done();
        })
        .catch(done.fail);
    });
  });
});
