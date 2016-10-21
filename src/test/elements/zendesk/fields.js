'use strict';

const suite = require('core/suite');
const payload = require('./assets/fields');

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
