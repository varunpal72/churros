'use strict';
const suite = require('core/suite');
const payload = require('./assets/userpayload.json');


suite.forPlatform('signup-partners',{payload:payload}, (test) => {
  test.withOptions(payload).should.return400OnPost();
});
