'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

//skipping the test as pagination is not proper from element itself.
suite.forElement('finance', 'tax-codes', null, (test) => {
  it.skip('should support SR, pagination and Ceql searching for /hubs/finance/tax-codes', () => {
    let id;
    return cloud.get(test.api)
      .then(r => id = r.body[0].ListID)
      .then(r => cloud.withOptions({ qs: { where: `ListID='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
  });
  test.should.supportPagination();
});
