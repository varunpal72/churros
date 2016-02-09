require('core/assertions');
const defaults = require('core/defaults');

describe('chakram defaults', () => {
  it('should support initializing our chakram defaults', () => {
    defaults('url', 'user', 'org');
  });

  it('should support resetting our chakram defaults after they have been initialized', () => {
    defaults('url', 'user', 'org');
    defaults.reset();
  });

  it('should support adding a token to our chakram defaults after they have been initialized', () => {
    defaults('url', 'user', 'org');
    defaults.token('token');
  });

  it('should throw error if resetting chakram defaults and never properly initialized', () => {
    defaults();
    try {
      defaults.reset();
    } catch (e) {
      return true;
    }
    throw Error('Fail...');
  });
});
