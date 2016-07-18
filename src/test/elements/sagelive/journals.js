'use strict';

const suite = require('core/suite');
const payload = require('./assets/journals');
const cloud = require('core/cloud');

suite.forElement('accounting', 'journals', { payload: payload }, (test) => {
  it('should allow CRUDS for journals', () => {
    var options = { "Name": "Churros update" };
    let journalId;
    return cloud.post(test.api, payload)
      .then(r => cloud.withOptions({ qs: { where: 'Name=\'ChurrosTest\'' } }).get(test.api))
      .then(r => journalId = r.body[0].Id)
      .then(r => cloud.patch(`${test.api}/${journalId}`, options))
      .then(r => cloud.get(`${test.api}/${journalId}`))
      .then(r => cloud.delete(`${test.api}/${journalId}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'LastModifiedDate>\'2016-06-20T23:58:03Z\'' } }).should.return200OnGet();
});
