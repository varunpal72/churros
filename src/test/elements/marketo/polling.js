'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const contactsPayload = {
  "person": {
    "lastName": tools.randomStr(),
    "firstName": tools.randomStr(),
    "email": tools.randomEmail()
  }
};
suite.forElement('marketing', 'polling', null, (test) => {
  test.withApi('/hubs/marketing/contacts').should.supportPolling(contactsPayload, 'contacts');
});
