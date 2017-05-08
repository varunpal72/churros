'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/feed-broker-rules');
const build = (overrides) => Object.assign({}, payload, overrides);
const expansionTypePayload = build({ Name: "name" + tools.randomInt(),PropertyName: "propertyname" + tools.randomInt()});

suite.forElement('finance', 'feed-broker-rules',{ payload:expansionTypePayload } , (test) => {
  let name;
  it('should support GET FeedBroker', () => {
    return cloud.get(`/hubs/finance/feed-brokers`)
      .then(r => expansionTypePayload.FeedBroker = r.body[0].id);
    });
    test.should.supportCruds();
    test.should.supportPagination();
    it('should support GET ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].Name);
      });
    test
     .withName(`should support searching ${test.api} by Name`)
     .withOptions({ qs: { where:`Name  ='${name}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Name === `${name}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
