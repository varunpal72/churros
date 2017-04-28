
'use strict';

const suite = require('core/suite');
const payload = require('./assets/fields');
const chakram = require('chakram');

const options = {
  churros: {
    updatePayload: {
      "displayOnScreenFlag": true,
    }
  }
};

suite.forElement('crm', 'fields', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);            //test put
  test.withOptions(options).should.supportCruds();  //test patch
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
