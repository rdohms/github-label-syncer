const _ = require('lodash');
const Label = require('./label');

module.exports.build = function (labels) {
  return labels.map((label) => new Label(label));
};

module.exports.compare = function (currentLabels, futureLabels) {
  let toCreate = _.differenceBy(futureLabels, currentLabels, 'name');
  let toDelete = _.differenceBy(currentLabels, futureLabels, 'name');

  const toUpdate = [];

  futureLabels.forEach((newLabel) => {
    const matching = _.filter(currentLabels, ['name', newLabel.name]);

    matching.forEach((matchingLabel) => {
      if (matchingLabel.hash() !== newLabel.hash()) {
        toUpdate.push({
          oldLabel: matchingLabel,
          newLabel,
        });
      }
    });

    if (matching.length !== 0) {
      return;
    }

    const toReplace = _.filter(currentLabels, (existingLabel) =>
      newLabel.shouldReplace(existingLabel)
    );

    if (toReplace.length > 0) {
      toUpdate.push({
        oldLabel: toReplace[0],
        newLabel,
      });

      toDelete = _.differenceBy(toDelete, toReplace, 'name');
      toCreate = _.reject(toCreate, ['name', newLabel.name]);
    }
  });

  return {
    replace: toUpdate,
    delete: toDelete,
    create: toCreate,
  };
};
