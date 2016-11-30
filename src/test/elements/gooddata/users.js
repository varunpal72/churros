'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');

suite.forElement('db', 'users', { payload: payload }, (test) => {
  test.withOptions({skip:true}).should.supportCruds();
  // get authenticated user info
  test.withApi(`${test.api}/{userId}`).should.return200OnGet();

});
