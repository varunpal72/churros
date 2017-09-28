'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

let options = {
  churros: {
    updatePayload: {
      "CategoryCode": "0023",
      "DocumentTypeCode": "OPPT",
      "SalesCycleCode": "001",
      "AccountID": "1001720"
    }
  }
};

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
