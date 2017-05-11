'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);


suite.forElement('marketing', 'contacts', {
  skip: true
}, (test) => {
  
  let listId, accountId;

  beforeEach(() => {
    return cloud.get('/hubs/marketing/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty;
        accountId = r.body[0].ClientID;
      })
      .then(r => {
        return cloud.withOptions(({
          qs: {
            where: `id = '${accountId}'`
          }
        })).get('hubs/marketing/lists');
      })
      .then(r => {
        expect(r.body).to.not.be.empty;
        listId = r.body[0].id;
      });
  });

  it(`Should allow CRUDS for ${test.api}`, () => {
    let email;
    return cloud.post(`hubs/marketing/lists/${listId}/contacts`, payload)
      .then(r => email = r.body.EmailAddress)
      .then(r => cloud.get(`hubs/marketing/lists/${listId}/contacts/${email}`))
      .then(r => cloud.patch(`hubs/marketing/lists/${listId}/contacts/${email}`, payload))
      .then(r => cloud.delete(`hubs/marketing/lists/${listId}/contacts/${email}`))
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'active'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      })
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'unconfirmed'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      })
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'unsubscribed'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      })
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'bounced'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      })
      .then(r => cloud.withOptions({
        qs: {
          where: "status = 'deleted'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
});
