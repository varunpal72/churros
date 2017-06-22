'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

//created contacts are created through a queue instead of immediately in CM. This makes following up a test with reads and updates fail sporadically
suite.forElement('marketing', 'lists/{id}/contacts', (test) => {
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

  it(`should allow CRUDS for ${test.api}`, () => {
    let email;
    return cloud.post(`hubs/marketing/lists/${listId}/contacts`, payload)
      .then(r => email = r.body.EmailAddress)
      .then(r => cloud.get(`hubs/marketing/lists/${listId}/contacts/${email}`))
      .then(r => cloud.patch(`hubs/marketing/lists/${listId}/contacts/${email}`, payload))
      .then(r => cloud.delete(`hubs/marketing/lists/${listId}/contacts/${email}`));
  });

  it(`should allow paginating with page and pageSize for ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1, pageSize: 10, where: `status = 'active'` } }).get(`/lists/${listId}/contacts`)
      .then(r => expect(r.body.length).to.be.below(10))
      .then(r => cloud.withOptions({ qs: { page: 2, pageSize: 10, where: `status = 'active'` } }).get(`/lists/${listId}/contacts`))
      .then(r => expect(r.body.length).to.be.below(10));
  });

  it(`should allow where clause with status = active ${test.api}`, () => {


    return cloud.withOptions({
        qs: {
          where: "status = 'active'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });

  it(`should allow where clause with status = unconfirmed for ${test.api}`, () => {
    return cloud.withOptions({
        qs: {
          where: "status = 'unconfirmed'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
  it(`should allow where clause with status = unsubscribed for ${test.api}`, () => {
    cloud.withOptions({
        qs: {
          where: "status = 'unsubscribed'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
  it(`should allow where clause with status = bounced for ${test.api}`, () => {
    cloud.withOptions({
        qs: {
          where: "status = 'bounced'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
  it(`should allow where clause with status = deleted for ${test.api}`, () => {
    cloud.withOptions({
        qs: {
          where: "status = 'deleted'"
        }
      }).get(`hubs/marketing/lists/${listId}/contacts`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.undefined;
        expect(r.body).to.not.be.null;
      });
  });
});