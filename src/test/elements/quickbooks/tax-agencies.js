'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload= require('./assets/tax-agencies');
const build = (overrides) => Object.assign({}, payload, overrides);
const agencyPayload = build({"displayName": tools.random()});

suite.forElement('finance', 'tax-agencies', { payload: agencyPayload, skip: true }, (test) => {
  test.should.supportCrs();
});
