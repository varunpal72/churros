'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/activity-events.json`);

suite.forElement('crm', 'activity-events', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "subject": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
