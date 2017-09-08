'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');

suite.forElement('general', 'activities', { payload: payload }, (test) => {
  test.should.return200OnPost(payload);
});
