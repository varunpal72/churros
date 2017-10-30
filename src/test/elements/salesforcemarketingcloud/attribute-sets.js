'use strict';
const cloud = require('core/cloud');
const suite = require('core/suite');


suite.forElement('marketing', 'attribute-sets', (test) => {
  it('should allow R for /attribute-sets', () => {
    return cloud.get(`${test.api}`)
  });
});
