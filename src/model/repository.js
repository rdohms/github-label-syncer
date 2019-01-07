module.exports.parse = function(repository) {
  if (typeof repository !== 'string') {
    throw new Error('repository is not a string');
  }

  const parts = repository.split('/');

  if (parts.length != 2) {
    throw new Error('repository is not in format owner/repo');
  }

  return parts;
};
