const labels = require('../model/labels');

class LabelsApi {
  /**
   * @param {Object} options
   */
  constructor(opts) {
    this.owner = opts.owner;
    this.repo = opts.repo;

    this.github = opts.githubConstructor(opts.token);
  }

  async getLabels() {
    const existingLabels = await this.github.paginate(
      this.github.issues.listLabelsForRepo.endpoint.merge({
        owner: this.owner,
        repo: this.repo,
      })
    );

    return labels.build(existingLabels);
  }

  /**
   * @param {Object} operations
   * @returns {Promise}
   */
  async update(operations) {
    await Promise.all(
      operations.map((operation) => {
        this.github.issues.updateLabel({
          owner: this.owner,
          repo: this.repo,
          current_name: operation.oldLabel.name,
          name: operation.newLabel.name,
          color: operation.newLabel.color,
          description: operation.newLabel.description,
        });
      })
    );
  }

  /**
   * @param {LabelCollection} labels
   * @returns {Promise}
   */
  async create(labels) {
    await Promise.all(
      labels.map((label) => {
        this.github.issues.createLabel({
          owner: this.owner,
          repo: this.repo,
          name: label.name,
          color: label.color,
          description: label.description,
        });
      })
    );
  }

  /**
   * @param {LabelCollection} labels
   * @returns {Promise}
   */
  async delete(labels) {
    await Promise.all(
      labels.map((label) => {
        this.github.issues.deleteLabel({
          owner: this.owner,
          repo: this.repo,
          name: label.name,
        });
      })
    );
  }
}

module.exports = LabelsApi;
