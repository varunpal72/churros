'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/customers');
const cloud = require('core/cloud');
const billingPayload = require('./assets/billinginfo');
const invoicePayload = require('./assets/invoices');
const patchload = require('./assets/patch');
payload.account_code = tools.random();

suite.forElement('billing', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportNextPagePagination(2);
  test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z' and state = 'active'` } }).should.return200OnGet();
  test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet();

  it('should allow CUDS for /customers/:id/billing-info', () => {
    let id;
    payload.account_code = tools.random();
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/billing-info`, billingPayload))
      .then(r => cloud.get(`${test.api}/${id}/billing-info`))
      .then(r => cloud.patch(`${test.api}/${id}/billing-info`, patchload))
      .then(r => cloud.delete(`${test.api}/${id}/billing-info`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

  //skipping b/c we need a static ID (test2) and you can't create an invoice via the API
  it.skip('should allow CS for /customers/:id/invoice', () => {
    return cloud.post(`${test.api}/test2/invoices`, invoicePayload)
      .then(r => cloud.get(`${test.api}/test2/invoices`));
  });
});
