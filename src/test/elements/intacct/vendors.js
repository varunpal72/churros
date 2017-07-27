'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload =  tools.requirePayload(`${__dirname}/assets/vendor.json`);

suite.forElement('finance', 'vendors', { payload: payload }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.crds(test.api, payload);
  });
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
