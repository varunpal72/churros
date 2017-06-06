'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/leads.json`);

let options = {
  churros: {
    updatePayload: {
      "Name": "Let's update this",
      "Company": "churroz",
      "ContactFirstName": "Mister",
      "ContactLastName": "Churro"
    }
  }
};

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
