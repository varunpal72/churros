'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const leadsPayload = build({ lastName: tools.random(), firstName: tools.random(), email: tools.randomEmail() });
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;

suite.forElement('crm', 'leads', { payload: leadsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "firstName": tools.random(),
        "lastName": tools.random(),
        "email": tools.randomEmail()
      }
    }
  };
  var leadFloatUpdate = {
    attributes : {
      address1_latitude : 4.4,
      address1_city : ""
    }
  };
  it('Float And Null Update Test for /hubs/crm/leads', () => {
      var leadId = null;
      return cloud.post(test.api, leadsPayload)
        .then(r => leadId = r.body.id)
        .then(() => cloud.patch(`${test.api}/${leadId}`, leadFloatUpdate,(r) => {
          expect(r.body.attributes.address1_latitude).to.equal(4.4);
          expect(r.body.attributes.address1_city).to.equal(undefined);
          })
        )
        .then(r => cloud.delete(`${test.api}/${leadId}`));
  });

  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
