'use strict';

const suite = require('core/suite');
const payload = require('./assets/order-parts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ Name: tools.random() });

suite.forElement('fsa', 'order-parts', { payload: productsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "SVMXC__On_Hold__c": false
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');

});
