'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/fields');

payload.key += tools.random();

const options = {
  churros: {
    updatePayload: {
      "name": "UpdateGroupName",
    }
  }
};

suite.forElement('helpdesk', 'fields', { payload }, (test) => {
  test.withApi(`${test.api}/incident-field`).withOptions(options).should.supportCruds();
  test.withApi(`${test.api}/user-field`).withOptions(options).should.supportCruds();
});
