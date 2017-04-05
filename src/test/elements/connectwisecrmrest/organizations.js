'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/organizations');

const options = {
  churros: {
    updatePayload: {
      "identifier": "xyz10",
      "name": "abc",
      "billToCompany": {
        "id": "644"
      }
    }
  }
};

suite.forElement('crm', 'organizations', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();  //test patch
  test.should.supportCruds(chakram.put);            //test PUT
  test.should.supportCeqlSearch('id');
});
