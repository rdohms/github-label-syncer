const crypto = require('crypto');

class Label {
  constructor(info) {
    this.name = info.name;
    this.description = info.description || '';
    this.color = info.color || '';
    this.replaces = info.replaces || [];
  }

  /**
   * @param {Label} label
   */
  shouldReplace(label) {
    return label.name === this.name || this.replaces.includes(label.name);
  }

  hash() {
    return crypto
      .createHash('sha1')
      .update(`${this.name}:${this.description}:${this.color}`)
      .digest('utf-8');
  }
}

module.exports = Label;
