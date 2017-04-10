'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const chakram = require('chakram');

const options = {
  churros: {
    updatePayload: {
      "firstName": "test_1"
    }
  }
};

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);            //test put
  test.withOptions(options).should.supportCruds();  //test patch
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.withName('should allow email search').withOptions({ qs: { where: `email='Test'` } }).should.return200OnGet();
});
