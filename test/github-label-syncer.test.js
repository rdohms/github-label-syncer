jest.mock('../src/label-syncer');
const GithubLabelSyncer = require('../github-label-syncer');
const innerSyncer = require('../src/label-syncer');

describe('GithubLabelSyncer', () => {
  beforeEach(() => {
    innerSyncer.mockClear();
  });

  it('configures and triggers syncer', async () => {
    const labelConfig = {
      labels: [
        {
          name: 'label',
          color: '',
          description: '',
          replaces: [],
        },
      ],
    };
    const syncer = new GithubLabelSyncer();
    await syncer.run('rdohms/Test', 'token', labelConfig, true);

    expect(innerSyncer.mock.instances[0].sync).toHaveBeenCalledWith(
      labelConfig.labels
    );
    const constructorArgs = innerSyncer.mock.calls[0][0];
    expect(constructorArgs.token).toEqual('token');
    expect(constructorArgs.owner).toEqual('rdohms');
    expect(constructorArgs.repo).toEqual('Test');
    expect(constructorArgs.dryRun).toEqual(true);
  });
});
