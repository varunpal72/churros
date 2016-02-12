require('core/assertions');
const defaults = require('core/defaults');

describe('chakram defaults', () => {
  it('should support initializing our chakram defaults', () => {
    defaults('url', 'user', 'org', 'unitTester');
  });

  it('should support resetting our chakram defaults after they have been initialized', () => {
    defaults('url', 'user', 'org', 'unitTester');
    defaults.reset();
  });

  it('should support adding a token to our chakram defaults after they have been initialized', () => {
    defaults('url', 'user', 'org', 'unitTester');
    defaults.token('token');
  });

  it('should throw error if setting chakram defaults improperly', () => {
    try {
      defaults();
    } catch (e) {
      return true;
    }
    throw Error('Fail...');
  });
});
