'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

let options = {
  churros : {
    updatePayload: {
      "FirstName": "Up",
      "LastName": "Date"
    }
  }
};

suite.forElement('helpdesk', 'contacts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
