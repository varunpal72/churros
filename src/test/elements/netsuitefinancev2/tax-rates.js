'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
suite.forElement('finance', 'tax-rates', (test) => {

  it('should shupport GET /tax-rates and GET /tax-rates/:id', () => {
    let taxId;
    return cloud.get(test.api)
      .then(r => taxId = r.body[0].internalId)
      .then(r => cloud.get(`${test.api}/${taxId}`));
  });
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'state = \'CA\'' } }).should.return200OnGet();
});
