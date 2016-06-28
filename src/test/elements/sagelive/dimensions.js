'use strict';

const suite = require('core/suite');
const payload = require('./assets/dimensions');
const cloud = require('core/cloud');


const options = {
  "Name": "Churros update"
};

suite.forElement('sage', 'dimensions', { payload: payload }, (test) => {
  let dimensionId;
  it('should allow CRUDS for dimensions', () => {
    return cloud.post(test.api, payload)
      .then(r => cloud.withOptions({ qs: { where: 'Name=\'ChurrosTest\'' } }).get(test.api))
      .then(r => dimensionId = r.body[0].Id)
      .then(r => cloud.patch(`${test.api}/${dimensionId}`, options))
      .then(r => cloud.get(`${test.api}/${dimensionId}`))
      .then(r => cloud.delete(`${test.api}/${dimensionId}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'LastModifiedDate>\'2016-06-20T23:58:03Z\'' } }).should.return200OnGet();
});
