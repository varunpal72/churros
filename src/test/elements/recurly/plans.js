'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/plans');
const build = (overrides) => Object.assign({}, payload, overrides);
const plansPayload = build({ plan_code: tools.randomInt() });


suite.forElement('billing', 'plans', { payload: plansPayload }, (test) => {
  test.should.supportCrs(); //not testing deleting as you can't delete a created plan
  test.should.supportNextPagePagination(2);
  test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z'` } }).should.return200OnGet();
  test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet()
});