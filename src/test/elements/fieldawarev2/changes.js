'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('fsa', 'changes', (test) => {
  it('should allow get all changes and latest changes', () => {
    return cloud.get(`/hubs/fsa/changes`)
      .then(r => cloud.get(`/hubs/fsa/changes/latest`));
  });
});
