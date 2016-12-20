'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const incidentPayload = build({ title: tools.random(), description: tools.random() });

suite.forElement('helpdesk', 'incidents', { payload: incidentPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "title": tools.random(),
        "priority": "1",
        "description": "This has been changed"
      }
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'priority = 1' } }).should.return200OnGet();
});
