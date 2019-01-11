#!/usr/bin/env node
/* eslint no-console: "off" */

const meow = require('meow');
const chalk = require('chalk');
const loadJsonFile = require('load-json-file');
const path = require('path');
const Octokit = require('@octokit/rest');
const LabelSyncer = require('./src/label-syncer');
const repositoryParser = require('./src/model/repository');
const labels = require('./src/model/labels');

const github = new Octokit({
  timeout: 0,
  headers: {
    'user-agent': '@rdohms/github-label-syncer',
    accept: 'application/vnd.github.symmetra-preview+json',
  },
});

async function run() {
  try {
    const [repository] = cli.input;
    const [owner, repo] = repositoryParser.parse(repository);
    const options = {
      dryRun: cli.flags.dryrun,
      token: cli.flags.token,
      config: cli.flags.config,
    };

    const json = await loadJsonFile(path.normalize(options.config));
    const syncer = new LabelSyncer({
      ...options,
      ...{ owner, repo, github },
    });

    const operations = await syncer.sync(labels.build(json.labels));

    if (!cli.flags.dryrun) {
      console.log(
        chalk.bgGreen(chalk.black('Successfully synchronized labels.'))
      );
    } else {
      console.log(
        chalk.bgYellow(chalk.black('Dry run, no labels are copied for real:'))
      );
    }

    console.log(
      chalk.green(`Created: ${operations.create.map(label => label.name)}`)
    );
    console.log(
      chalk.green(`Deleted: ${operations.delete.map(label => label.name)}`)
    );
    console.log(
      chalk.green(
        `Updated: ${operations.replace.map(
          label => `${label.oldLabel.name} => ${label.newLabel.name}`
        )}`
      )
    );
  } catch (error) {
    console.error(chalk.bgRed('Error!'));
    console.error(chalk.red(error));
  }
}

const cli = meow(
  `
Usage
    $ sync-labels -t <token> -c <config> <repository>

    Options
      -d           Dry run, don't actually copy anything
      -t, --token  Token to authenticate with GitHub API
      -c, --config Configuration file that holds desired labels

    Examples
      $ sync-labels -t token -c labels.json rdohms/label-manager
`,
  {
    flags: {
      dryrun: {
        type: 'boolean',
        alias: 'd',
        default: false,
      },
      token: {
        type: 'string',
        alias: 't',
      },
      config: {
        type: 'string',
        alias: 'c',
      },
    },
  }
);

if (!cli.flags.token) {
  cli.showHelp(1);
}

if (cli.input.length < 1) {
  cli.showHelp(1);
}

run();
