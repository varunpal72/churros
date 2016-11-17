'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const cloud = require('core/cloud');

suite.forElement('db', 'users', { payload: payload }, (test) => {
  // get authenticated user info
  test.withApi(`${test.api}/{userId}`).should.return200OnGet();
  // it('should allow GET for ' + test.api, () => {
  //   return cloud.get(`${test.api}/{userId}`);
  // });

});
