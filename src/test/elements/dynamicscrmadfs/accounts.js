'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountsPayload = build({ name: tools.random() });
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;


suite.forElement('crm', 'accounts', { payload: accountsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  var accountFloatUpdate = {
    attributes : {
      address1_latitude : 4.4,
      address1_city : ""
    }
  };
  it('Float And Null Update Test for /hubs/crm/accounts', () => {
      var accountId = null;
      return cloud.post(test.api, accountsPayload)
        .then(r => accountId = r.body.id)
        .then(() => cloud.patch(`${test.api}/${accountId}`, accountFloatUpdate,(r) => {
          expect(r.body.attributes.address1_latitude).to.equal(4.4);
          expect(r.body.attributes.address1_city).to.equal(undefined);
          })
        )
        .then(r => cloud.delete(`${test.api}/${accountId}`));
      });
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
