'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const shipmentsPayload = tools.requirePayload(`${__dirname}/assets/shipments.json`);
const creditMemosPayload = tools.requirePayload(`${__dirname}/assets/creditMemos.json`);
const invoicesPayload = tools.requirePayload(`${__dirname}/assets/invoices.json`);
const ordersPayload = tools.requirePayload(`${__dirname}/assets/orders.json`);
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);
const customerGroup = tools.requirePayload(`${__dirname}/assets/customerGroup.json`);

suite.forElement('ecommerce', 'polling', null, (test) => {
  test.withApi('/hubs/ecommerce/shipments').should.supportPolling(shipmentsPayload, 'shipments');
  test.withApi('/hubs/ecommerce/credit-memos').should.supportPolling(creditMemosPayload, 'credit-memos');
  test.withApi('/hubs/ecommerce/invoices').should.supportPolling(invoicesPayload, 'invoices');
  test.withApi('/hubs/ecommerce/orders').should.supportPolling(ordersPayload, 'orders');
  test.withApi('/hubs/ecommerce/products').should.supportPolling(productsPayload, 'products');
  const payload = (customerGroupId, storeId) => ({
    "customer": {
      "group_id": customerGroupId,
      "email": "ce" + tools.randomInt() + "@gmail.com",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "gender": 1,
      "store_id": storeId
    }
  });
  let customerGroupId, storeId;
  const customersPayload = () => cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup)
    .then(r => customerGroupId = r.body.id)
    .then(r => cloud.get(`/hubs/ecommerce/stores`))
    .then(r => storeId = r.body[0].id)
    .then(r => payload(customerGroupId, storeId));
  test.withApi('/hubs/ecommerce/customers').should.supportPolling(customersPayload, 'customers');
});
