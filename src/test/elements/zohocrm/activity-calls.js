'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/activity-calls.json`);

suite.forElement('crm', 'activity-calls', { payload: payload }, (test) => {
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
