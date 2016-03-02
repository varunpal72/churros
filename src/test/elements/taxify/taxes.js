'use strict';

const suite = require('core/suite');
const payload = require('./assets/taxes.create');
const badPayload = require('./assets/taxes.bad.create');

suite.forElement('finance', 'taxes', payload, (test) => {
  test.should.supportCd();
  test.withJson(badPayload).should.return400OnPost();
  test.withJson({}).should.return400OnPost();
});
