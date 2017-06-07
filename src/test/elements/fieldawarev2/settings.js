'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('fsa', 'settings', (test) => {
  it('should allow get settings', () => {
    return cloud.get(`/hubs/fsa/settings`);
  });
});
