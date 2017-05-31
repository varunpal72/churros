'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const payload = require('./assets/payments');

suite.forElement('finance', 'payments', { payload: payload, skip: true }, (test) => {
  it(`should allow CRS for ${test.api}`, () => {
    return cloud.crs(test.api, payload);
  });
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
