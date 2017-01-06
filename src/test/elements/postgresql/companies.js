'use strict';

const suite = require('core/suite');
const payload = require('./assets/companies');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const companyPayload = build({ id: tools.randomInt(), name: tools.random() });
suite.forElement('db', 'companies', { payload: companyPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
