'use strict';

const suite = require('core/suite');


suite.forElement('marketing', 'lists', {}, (test) => {

  const payload = require('./assets/lists');
  const cloud = require('core/cloud');
  const expect = require('chakram').expect;

  let accountId;

  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty
        accountId = r.body[0].ClientID
      })
  });

  it(`Should perform CRUD for ${test.api}`, () => {

    payload.ClientID = accountId;

    return cloud.post('hubs/marketing/lists', payload)
      .then(r => {
        var listID = r.body.id
        return cloud.get('hubs/marketing/lists/' + listID)
          .then(r => cloud.patch('hubs/marketing/lists/' + listID, payload))
          .then(r => cloud.delete('hubs/marketing/lists/' + listID))
          .then(r => cloud.withOptions(({
            qs: {
              where: "id =" + "'" + accountId + "'"
            }
          })).get('hubs/marketing/lists'))
      })
  });
});
