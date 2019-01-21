#!/usr/bin/env node
/* eslint no-console: "off" */

const meow = require('meow');
const chalk = require('chalk');
const loadJsonFile = require('load-json-file');
const path = require('path');
const GithubLabelSyncer = require('./github-label-syncer');

async function run() {
  try {
    const labelConfiguration = await loadJsonFile(
      path.normalize(cli.flags.config)
    );
    const [repository] = cli.input;

    const syncer = new GithubLabelSyncer();
    const operations = await syncer.run(
      repository,
      cli.flags.token,
      labelConfiguration,
      cli.flags.dryrun
    );

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
    $ github-label-syncer -t <token> -c <config> <repository>

    Options
      -d           Dry run, don't actually copy anything
      -t, --token  Token to authenticate with GitHub API
      -c, --config Configuration file that holds desired labels

    Examples
      $ github-label-syncer -t token -c labels.json rdohms/label-manager
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

if (!cli.flags.token || cli.input.length < 1) {
  cli.showHelp(1);
}

run();
