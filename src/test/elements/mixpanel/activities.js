'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');

suite.forElement('general', 'activities', { payload: payload }, (test) => {
  test.should.return200OnPost(payload);
  test.withOptions({ qs: { where: `type = 'general'` } }).withApi('/hubs/general/activities/top').should.return200OnGet();
});
