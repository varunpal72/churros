'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/tasks');

suite.forElement('crm', 'tasks', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Subject": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('subject');
});
