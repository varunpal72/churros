'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'payment-methods', (test) => {
  it(`should support paging, Ceql search and SR for ${test.api}`, () => {
    let Id;
    return cloud.get(test.api)
      .then(r => Id = r.body[0].internalId)
      .then(r => cloud.get(`${test.api}/${Id}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 5 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'isInactive = \'false\'' } }).get(test.api));
  });
});
