const labels = require('./model/labels');
const LabelsApi = require('./client/labels-api');

class LabelSyncer {
  constructor(opts) {
    this.api = new LabelsApi(opts);
    this.dryRun = opts.dryRun;
  }

  /**
   * @param {Label[]} futureLabels List of the desired state of labels
   * @returns {Object} A list of executed operations
   */
  async sync(futureLabels) {
    const currentLabels = await this.api.getLabels();
    const operations = labels.compare(currentLabels, futureLabels);

    if (this.dryRun) {
      return operations;
    }

    await Promise.all([
      this.api.update(operations.replace),
      this.api.create(operations.create),
      this.api.delete(operations.delete),
    ]);

    return operations;
  }
}

module.exports = LabelSyncer;
