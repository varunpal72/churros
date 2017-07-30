'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

suite.forElement('general', 'contacts', { payload: payload }, (test) => {

const options = {
    churros: {
      updatePayload: {
            "email": "alanGardner@hangover.com",
            "firstName": "Alan",
            "lastName": "Gardner"
          }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.should.supportCeqlSearch('email');
});
