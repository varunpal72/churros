'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/accounts.json`);

let options = {
  churros : {
    updatePayload: {
      "AccountName": "Update"
    }
  }
};

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
