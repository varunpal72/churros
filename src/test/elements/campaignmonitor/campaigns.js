'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;
const payload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);

suite.forElement('marketing', 'campaigns', (test) => {
  let accountId;
  before(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty;
        accountId = r.body[0].ClientID;
        payload.ClientID = accountId;
      })
      .then(r => cloud.withOptions(({
        qs: {
          where: `id = '${accountId}'`
        }
      })).get('hubs/marketing/lists'))
      .then(r => {
        expect(r.body).to.not.be.empty;
        payload.ListIDs.push(r.body[0].id);
      });
  });

  it(`should allow CRDS for ${test.api}`, () => {
    let campaingID;
    return cloud.post('hubs/marketing/campaigns', payload)
      .then(r => campaingID = r.body.id)
      .then(r => cloud.get(`hubs/marketing/campaigns/${campaingID}`))
      .then(r => cloud.delete(`hubs/marketing/campaigns/${campaingID}`));
  });

  it(`should allow paginating with page and pageSize for ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1, pageSize: 1, where: `id = '${accountId}' and status = 'draft'` } }).get(test.api)
      .then(r => expect(r.body.length).to.be.below(2));
  });

  it(`should allow where clause with status = sent for ${test.api}`, () => {
    return cloud.withOptions(({
        qs: {
          where: `id = '${accountId}' and status = 'sent'`
        }
      })).get('hubs/marketing/campaigns')
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });

  it(`should allow where clause with status = scheduled for ${test.api}`, () => {
    return cloud.withOptions(({
        qs: {
          where: `id = '${accountId}' and status = 'scheduled'`
        }
      })).get('hubs/marketing/campaigns')
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });

  it(`should allow where clause with status = draft for ${test.api}`, () => {
    return cloud.withOptions(({
        qs: {
          where: `id = '${accountId}' and status = 'draft'`
        }
      })).get('hubs/marketing/campaigns')
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
});