'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'tax-codes', (test) => {
  it('should shupport GET /tax-codes and GET /tax-codes/:id', () => {
    let taxId;
    return cloud.get(test.api)
      .then(r => taxId = r.body[0].internalId)
      .then(r => cloud.get(`${test.api}/${taxId}`));
  });
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'preferred = \'true\'' } }).should.return200OnGet();
});
