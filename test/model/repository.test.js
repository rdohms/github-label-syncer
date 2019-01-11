const repositoryParser = require('../../src/model/repository');

describe('Repository Parser', () => {
  describe('parse', () => {
    it('splits repository correctly', () => {
      expect(repositoryParser.parse('rdohms/repo')).toEqual(['rdohms', 'repo']);
    });

    it('throws error for non-string repository', () => {
      expect(() => {
        repositoryParser.parse({});
      }).toThrow();
    });

    it('throws error when format has too many parts', () => {
      expect(() => {
        repositoryParser.parse('owner/repo/x');
      }).toThrow();
    });

    it('throws error when format has not enough parts', () => {
      expect(() => {
        repositoryParser.parse('owner');
      }).toThrow();
    });
  });
});
