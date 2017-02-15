'use strict';
const suite = require('core/suite');
const payload = require('./assets/userpayload.json');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;



suite.forPlatform('signup-partners',{payload:payload}, (test) => {
  it('should respond with 401', () => {
      return cloud.post('/signup-partners',payload, (r) => expect(r).to.have.statusCode(401));
    });

});
