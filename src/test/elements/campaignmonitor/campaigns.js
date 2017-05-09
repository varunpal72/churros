'use strict';
const suite = require('core/suite');

suite.forElement('marketing', 'campaigns', {}, (test) => {

  const payload = require('./assets/campaigns');
  const cloud = require('core/cloud');
  const expect = require('chakram').expect;
  
  let listId;
  let accountId;


  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty
        accountId = r.body[0].ClientID
      })
      .then(r => cloud.withOptions(({
          qs: {
            where: "id =" + "'" + accountId + "'"
          }
        })).get('hubs/marketing/lists')
      )
      .then(r => {
        expect(r.body).to.not.be.empty
        listId = r.body[0].id
      })
  });


  it(`Should perform CRDs for ${test.api}`, () => {

    payload.ListIDs.push(listId);
    payload.ClientID = accountId;

    return cloud.post('hubs/marketing/campaigns', payload)
      .then(r => {
        var campaingID = r.body.id
        return cloud.get(`hubs/marketing/campaigns/${campaingID}`)
          .then(r => cloud.delete(`hubs/marketing/campaigns/${campaingID}`))
          .then(r => cloud.withOptions(({
            qs: {
              where: "id =" + "'" + accountId + "'" + " and status = 'sent'"
            }
          })).get('hubs/marketing/campaigns'))
      })
  });
});
