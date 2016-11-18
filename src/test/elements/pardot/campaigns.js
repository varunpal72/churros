'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withName('should support searching campaigns by created_after').withOptions({ qs: { where: 'created_after=\'2015-01-01\'' } }).should.return200OnGet();
});
