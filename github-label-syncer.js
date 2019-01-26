const repositoryParser = require('./src/model/repository');
const labels = require('./src/model/labels');
const Octokit = require('@octokit/rest');
const LabelSyncer = require('./src/label-syncer');

class GithubLabelSyncer {
  constructor() {
    this.options = {
      github: new Octokit({
        timeout: 0,
        headers: {
          'user-agent': '@rdohms/github-label-syncer',
          accept: 'application/vnd.github.symmetra-preview+json',
        },
      }),
    };
  }

  async run(repository, token, labelConfiguration, dryRun = false) {
    const [owner, repo] = repositoryParser.parse(repository);
    const syncer = new LabelSyncer({
      ...this.options,
      token,
      owner,
      repo,
      dryRun,
    });
    return await syncer.sync(labels.build(labelConfiguration.labels));
  }
}

module.exports = GithubLabelSyncer;
