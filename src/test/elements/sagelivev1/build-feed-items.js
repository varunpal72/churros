'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/build-feed-items');
const build = (overrides) => Object.assign({}, payload, overrides);
const buildFeedItemsPayload = build({ Name: "name" + tools.randomInt()});

suite.forElement('finance', 'build-feed-items',{ payload:buildFeedItemsPayload, skip: true }, (test) => {
  let name,number;
  it('should support GET /accounts', () => {
    return cloud.get('/hubs/finance/accounts')
      .then(r => number = r.body[0].Ownerid)
      .then(r => buildFeedItemsPayload.SetupOwnerId=number);
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
