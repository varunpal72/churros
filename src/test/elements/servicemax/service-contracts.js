'use strict';

const suite = require('core/suite');
const payload = require('./assets/service-contracts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ Name: tools.random() });

suite.forElement('fsa', 'service-contracts', { payload: productsPayload }, (test) => {

  const options = {
    churros: {
      updatePayload: {
        "Name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');

});
