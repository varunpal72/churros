'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const customerPayload = require('./assets/customers');
const expect = require('chakram').expect;

suite.forElement('fsa', 'contacts', { payload: payload }, (test) => {
  let customerId;
  before(() => {
    return cloud.post('/hubs/fsa/customers', customerPayload)
    .then(r => customerId = r.body.id)
    .then(r => payload.customer.uuid = customerId);
  });
  test.should.supportPagination();
  it(`should allow CRUDS for ${test.api}`, () => cloud.cruds(test.api, payload));
  it('should support searching /hubs/fsa/contacts by firstName', () => {
    let id, value;
    return cloud.post(test.api, payload)
      .then(r => {
        id = r.body.id;
        value = r.body.firstName;
        const clause = `firstName='${value}'`; // have to escape where values with single quotes
        const myOptions = { qs: { where: clause } };
        return cloud.withOptions(myOptions).get(test.api, (r) => {
          expect(r).to.have.statusCode(200);
          r.body.forEach(resource => {
            expect(resource.firstName).to.equal(value);
          });
        });
      })
      .then(r => cloud.delete(test.api + '/' + id));
  });

  after(() => cloud.delete(`/hubs/fsa/customers/${customerId}`));

});
