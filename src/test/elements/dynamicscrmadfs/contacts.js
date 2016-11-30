'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ lastName: tools.random(), firstName: tools.random(), email: tools.randomEmail() });

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "firstName": tools.random(),
        "lastName": tools.random(),
        "email": tools.randomEmail()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});