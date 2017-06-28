'use strict';

const suite = require('core/suite');
const contactsPayload = require('./assets/contacts');

// Wasn't able to test since didn't provision so will skip until vailidated
suite.forElement('sageaccounting', 'polling', {skip:true}, (test) => {
  test.withApi('/hubs/sageaccounting/contacts').should.supportPolling(contactsPayload, 'Contact');
});
