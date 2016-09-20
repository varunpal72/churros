'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerPayload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: customerPayload }, (test) => {
  const build = (overrides) => Object.assign({}, customerPayload, overrides);
  const payload = build({ lastName: tools.random(), firstName: tools.random(), mobile: tools.randomInt() + '7153' + tools.randomInt() });
  it('should create a customer and then CRDS for an attachment', () => {
    let path = __dirname + '/assets/temp.png';
    let customerId, attachmentId;
    return cloud.post(test.api, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.postFile(`${test.api}/${customerId}/attachments`, path))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/attachments`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.get(`${test.api}/${customerId}/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${customerId}/attachments/${attachmentId}`));
  });
});
