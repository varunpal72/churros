'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

let options = {
  churros : {
    updatePayload: {
      "AccountName": "Update"
    }
  }
};

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
