'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const opportunitiesPayload = build({ name: tools.random() });
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;

suite.forElement('crm', 'opportunities', { payload: opportunitiesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };

  var opportunityFloatUpdate = {
    attributes : {
      int_forecast : 3000,
      proposedsolution : ""
    }
  };
  it('Float And Null Update Test for /hubs/crm/opportunities', () => {
      var id = null;
      return cloud.post(test.api, opportunitiesPayload)
        .then(r => id = r.body.id)
        .then(() => cloud.patch(`${test.api}/${id}`, opportunityFloatUpdate,(r) => {
          expect(r.body.attributes.int_forecast).to.equal(3000);
          expect(r.body.attributes.proposedsolution).to.equal(undefined);
          })
        )
        .then(r => cloud.delete(`${test.api}/${id}`));
  });


  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
