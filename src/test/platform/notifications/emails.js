'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const email = require('./assets/email');
const emailSchema = require('./assets/email.schema');

suite.forPlatform('notifications/emails', {payload: email, email: emailSchema}, (test) => {

  test
  .withName('should send email')
  .withJson(email)
  .withValidation((r) => expect(r.body).to.be.empty)
  .should.return200OnPost({});

  test
  .withName('should fail for empty email body')
  .withJson({})
  .withValidation((r) => expect(r.body).to.be.empty)
  .should.return400OnPost({});
});
