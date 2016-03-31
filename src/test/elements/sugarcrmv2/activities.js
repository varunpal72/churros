'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const chakram = require('chakram');

suite.forElement('crm', 'activities', { payload: payload }, (test) => {
  const opts = { qs: { type: 'calls' } };
  test.withOptions(opts).should.supportCruds(chakram.put);
  test.withOptions(opts).should.supportPagination();
});
