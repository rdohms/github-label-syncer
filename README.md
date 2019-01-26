# GitHub Label Syncer

The goal of this project is to make it simple for a standard set of labels to be included in every github project. Based on a configuration file it automatically creates, replaces, removes and updates existing libraries to match the desired output.

# Usage

## CLI
This library can be run from the command line, with a few parameters and a configuration file.

To see detailed instructions run:
`$ ./cli.js -h`

Example off a call:
`$ ./cli.js -t XXXX -c mock/sample.config.json rdohms/my-repo`

## Via code

```js
const GithubLabelSyncer = require('./github-label-syncer');
const syncer = new GithubLabelSyncer();
const operations = syncer.run(
      repository,
      token,
      labelConfiguration,
      dryRun
    );
```

# Configuration

This an example configuration file:

```json
{
    "labels": [{
        "name": "BC-break",
        "replaces": [],
        "color": "6a1993",
        "description": "This issue or pull request breaks backwards compatibility"
    }, {
        "name": "Bug",
        "replaces": ["fault", "defect"],
        "color": "b60205",
        "description": "Something isn't working"
    }]
}
```
