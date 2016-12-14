'use strict';

const suite = require('core/suite');
const payload = require('./assets/activity-events');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const eventsPayload = build({ subject: tools.random() });

suite.forElement('crm', 'activity-events', { payload: eventsPayload }, (test) => {
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
