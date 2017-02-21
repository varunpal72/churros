'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const chakram = require('chakram');
const tools = require('core/tools');

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  test.should.supportPagination();
test.withOptions(options).should.supportCruds(chakram.put);
});
