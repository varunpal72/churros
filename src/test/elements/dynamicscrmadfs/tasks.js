'use strict';

const suite = require('core/suite');
const payload = require('./assets/tasks');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const tasksPayload = build({ subject: tools.random(), description: tools.random() });

suite.forElement('crm', 'tasks', { payload: tasksPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "description": tools.random(),
        "subject": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});