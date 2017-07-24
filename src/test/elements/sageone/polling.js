'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const contactsPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);

// Wasn't able to test since didn't provision so will skip until vailidated
suite.forElement('finance', 'polling', {skip:true}, (test) => {
  test.withApi('/hubs/finance/contacts').should.supportPolling(contactsPayload, 'contacts');
});
