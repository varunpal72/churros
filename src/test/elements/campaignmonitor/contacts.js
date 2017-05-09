'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'contacts', {skip:true}, (test) => {

  const payload = require('./assets/contacts');
  const cloud = require('core/cloud');
  const tools = require('core/tools');
  const expect = require('chakram').expect;
  payload.EmailAddress = tools.randomEmail()
  
  var email;

  let listId;
  let accountId;

  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty
        accountId = r.body[0].ClientID
      })
      .then(r => {
        return cloud.withOptions(({
          qs: {
            where: "id =" + "'" + accountId + "'"
          }
        })).get('hubs/marketing/lists')
      })
      .then(r => {
        expect(r.body).to.not.be.empty
        listId = r.body[0].id
      })
  });

  it(`Should perform CRUDS for ${test.api}`, () => {
    console.log(payload)
    var email;
    return cloud.post(`hubs/marketing/lists/${listId}/contacts`, payload)
      .then(r => {
        expect(r.body).to.not.be.empty
        email = r.body.EmailAddress;
        return email
      })
      .then(r => cloud.get(`hubs/marketing/lists/${listId}/contacts/${email}`))
      .then(r => cloud.patch(`hubs/marketing/lists/${listId}/contacts/${email}`, payload))
      .then(r => cloud.delete(`hubs/marketing/lists/${listId}/contacts/${email}`))
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'active'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))


  })
});
