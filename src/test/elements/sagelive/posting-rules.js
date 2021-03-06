'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('sageaccounting', 'posting-rules', {skip: true}, (test) => {
  it('should allow Sr for posting-rules', () => {
    let ruleId;
    return cloud.get(test.api)
      .then(r => ruleId = r.body[0].Id)
      .then(r => cloud.get(`${test.api}/${ruleId}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'LastModifiedDate>\'2016-06-20T23:58:03Z\'' } }).should.return200OnGet();
});
