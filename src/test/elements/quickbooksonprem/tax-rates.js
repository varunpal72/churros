'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

//skipping the test as pagination is not proper from element itself.
suite.forElement('finance', 'tax-rates', null, (test) => {
  it.skip('should support S for /hubs/finance/tax-rates', () => {
    return cloud.get(test.api);
  });
  test.should.supportPagination();
});
