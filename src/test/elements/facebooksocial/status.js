'use strict';

const suite = require('core/suite');
const payload = require('./assets/status');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const statusPayload = build({ message: tools.random() });

suite.forElement('social', 'status', { payload:statusPayload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
});
