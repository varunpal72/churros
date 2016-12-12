'use strict';

const suite = require('core/suite');
const payload = require('./assets/departments');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const departments = build({ name: tools.random(), fullyQualifiedName: tools.random()});

suite.forElement('finance', 'departments', { payload: departments, skip: false}, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random(),
        "fullyQualifiedName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('name');
});
