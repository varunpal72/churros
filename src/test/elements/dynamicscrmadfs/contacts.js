'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ lastName: tools.random(), firstName: tools.random(), email: tools.randomEmail() });
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;

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
  var contactFloatUpdate = {
    attributes : {
      address1_latitude : 4.4,
      address1_city : ""
    }
  };
  it('Float And Null Update Test for /hubs/crm/contacts', () => {
      var contactId = null;
      return cloud.post(test.api, contactsPayload)
        .then(r => contactId = r.body.id)
        .then(() => cloud.patch(`${test.api}/${contactId}`, contactFloatUpdate,(r) => {
          expect(r.body.attributes.address1_latitude).to.equal(4.4);
          expect(r.body.attributes.address1_city).to.equal(undefined);
          })
        )
        .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
