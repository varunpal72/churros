'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const opportunitiesPayload = build({ name: tools.random() });

suite.forElement('crm', 'opportunities', { payload: opportunitiesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});