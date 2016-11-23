'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const cloud = require('core/cloud');

suite.forElement('db', 'users', { payload: payload }, (test) => {

  test.withOptions({skip:true}).should.supportCruds();
  // get authenticated user info
  test.withApi(`${test.api}/{userId}`).should.return200OnGet();
  // test.should.supportSr();
  // it('should allow PATCH for ' + test.api, () => {
  //   let userBody = {
  //     "firstName": 'Jack',
  //     "lastName": 'Churro Master'
  //   };
  //   return cloud.patch(`${test.api}/{userId}`, userBody);
  // });


});
