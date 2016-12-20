'use strict';

const suite = require('core/suite');
const payload = require('./assets/activity-calls');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const callsPayload = build({ subject: tools.random(), description: tools.random() });

suite.forElement('crm', 'activity-calls', { payload: callsPayload }, (test) => {
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