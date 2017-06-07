'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const payload = require('./assets/sales-orders');

suite.forElement('finance', 'sales-orders', { payload: payload }, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    return cloud.cruds(test.api, payload);
  });
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
