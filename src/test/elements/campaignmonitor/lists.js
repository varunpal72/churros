'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('marketing', 'lists', (test) => {
  let accountId;
  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty;
        accountId = r.body[0].ClientID;
        payload.ClientID = accountId;
      });
  });

  it(`should allow paginating with page and pageSize for ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1, pageSize: 1, where: `id = '${accountId}'` } }).get(test.api)
      .then(r => expect(r.body.length).to.be.below(2));
  });

  it(`should allow CRUDs for ${test.api}`, () => {
    let listID;
    return cloud.post('hubs/marketing/lists', payload)
      .then(r => listID = r.body.id)
      .then(r => cloud.get(`hubs/marketing/lists/${listID}`))
      .then(r => cloud.patch(`hubs/marketing/lists/${listID}`, payload))
      .then(r => cloud.delete(`hubs/marketing/lists/${listID}`))
      .then(r => cloud.withOptions(({
        qs: {
          where: ` id = '${accountId}' `
        }
      })).get('hubs/marketing/lists'))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
});