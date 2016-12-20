'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const tasksPayload = build({ subject: tools.random(), description: tools.random() });

suite.forElement('crm', 'leads', { payload: tasksPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "subject": tools.random(),
        "description": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});