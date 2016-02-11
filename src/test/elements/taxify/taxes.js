'use strict';

const tester = require('core/tester');
const schema = require('./assets/taxes.schema');
const payload = require('./assets/taxes.create');
const badPayload = require('./assets/taxes.bad.create');

tester.forElement('finance', 'taxes', payload, schema, (suite) => {
  suite.should.return200OnPost();
  suite.withJson(badPayload).should.return400OnPost();
  suite.withJson({}).should.return400OnPost();
});
