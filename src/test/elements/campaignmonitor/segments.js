'use strict';
const suite = require('core/suite');

suite.forElement('marketing', 'segments', {}, (test) => {
  const payload = require('./assets/segments');
  const cloud = require('core/cloud');
  const tools = require('core/tools');
  const expect = require('chakram').expect;
  let listId;
  let accountId;
  payload.Title = tools.random();

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
      })).get('hubs/marketing/lists'))
      .then(r => {
        expect(r.body).to.not.be.empty
        listId = r.body[0].id
      })
  });

  it(`Should perform CRUD for ${test.api}`, () => {
    payload.ListID = listId;
    let segmentId

    return cloud.post(`hubs/marketing/segments`, payload)
      .then(r => {
        segmentId = r.body.id;
        return cloud.get(`hubs/marketing/segments/${segmentId}`)
          .then(r => cloud.patch(`hubs/marketing/segments/${segmentId}`, payload))
          .then(r => cloud.delete(`hubs/marketing/segments/${segmentId}`))
          .then(r => cloud.withOptions(({
            qs: {
              where: "id =" + "'" + accountId + "'"
            }
          })).get('hubs/marketing/segments'))
      })
  })
});
