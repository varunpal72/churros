'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('screening', 'packages', (test) => {

  it('should allow listing packages', () => {
    return cloud.get('/hubs/screening/packages');
  });

});
