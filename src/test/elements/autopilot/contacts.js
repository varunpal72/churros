'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = chakram.expect;

const payload = (email) => ({
  "FirstName": "Mr.",
  "LastName": "Churro",
  "Email": email
});

const updatePayload = () => ({
  "FirstName": "Mister"
});

suite.forElement('marketing', 'contacts', { skip: true }, (test) => {

  it('should allow CRUDS for /hubs/marketing/contacts', () => {
    let email = tools.randomEmail().toString();
    let contactId = -1;
    return cloud.post(test.api, payload(email))
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${email}`, updatePayload()))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
  it('should allow cursor pagination for /hubs/marketing/contacts', () => {
    const options = { qs: { pageSize: 100 } };
    return cloud.withOptions(options).get(test.api)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(test.api);
      });
  });
});
