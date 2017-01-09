'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');

const options = {
  churros: {
    updatePayload: {
      "name": "Changed Robot Name",
      "alias": "Updated Data",
      "phone": "303-555-3434",
      "details": "This isn't the data that used to be here",
      "notes": "This data has been changed!"
    }
  }
};

payload.email = tools.randomEmail();

suite.forElement('helpdesk', 'contacts', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
