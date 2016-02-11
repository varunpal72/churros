'use strict';

const suite = require('core/suite');
const schema = require('./assets/taxes.schema');
const payload = require('./assets/taxes.create');
const badPayload = require('./assets/taxes.bad.create');

suite.forElement('finance', 'taxes', payload, schema, (test) => {
  test.should.return200OnPost();
  test.withJson(badPayload).should.return400OnPost();
  test.withJson({}).should.return400OnPost();
});
