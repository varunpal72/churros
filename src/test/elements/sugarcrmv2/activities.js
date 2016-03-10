'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const chakram = require('chakram');

suite.forElement('crm', 'activities', payload, (test) => {
  test.withOptions({ qs: { type: 'calls' } }).should.supportCruds(chakram.put);
  test.withOptions({ qs: { type: 'calls' } }).should.supportPagination();
});