'use strict';

const suite = require('core/suite');
const payload = require('./assets/jobs');

suite.forElement('marketing', 'jobs', { skip: true, payload: payload }, (test) => {
  test.should.return200OnPost();
});
