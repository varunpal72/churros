'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;
const payload = tools.requirePayload(`${__dirname}/assets/segments.json`);

suite.forElement('marketing', 'segments', {}, (test) => {
  let accountId;

  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty;
        accountId = r.body[0].ClientID;
      })
      .then(r => cloud.withOptions(({
        qs: {
          where: ` id = '${accountId}' `
        }
      })).get('hubs/marketing/lists'))
      .then(r => {
        expect(r.body).to.not.be.empty;
        payload.ListID = r.body[0].id;
      });
  });

  it(`Should allow CRUDS for ${test.api}`, () => {
    let segmentId;

    return cloud.post(`hubs/marketing/segments`, payload)
      .then(r => segmentId = r.body.id)
      .then(r => cloud.get(`hubs/marketing/segments/${segmentId}`))
      .then(r => cloud.patch(`hubs/marketing/segments/${segmentId}`, payload))
      .then(r => cloud.delete(`hubs/marketing/segments/${segmentId}`))
      .then(r => cloud.withOptions(({
        qs: {
          where: ` id = '${accountId}' `
        }
      })).get('hubs/marketing/segments'))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
});
