'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'transactions', null, (test) => {
  let transactionsId;
  it('Should support GET', () => {
    return cloud.get(test.api)
      .then(r => transactionsId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + transactionsId))
  });
  test.should.supportPagination();
  test.withOptions({qs: {where: 'date_time_updated>\'2016-03-04T17:35:41.453\''}}).should.return200OnGet();
});
