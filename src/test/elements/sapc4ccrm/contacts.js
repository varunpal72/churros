'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/contacts.json`);

let options = {
  churros : {
    updatePayload: {
      "FirstName": "Up",
      "LastName": "Date"
    }
  }
};

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
