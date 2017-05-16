'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const creditMemosPayload = require('./assets/credit-memos');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);
const invoicesPayload = tools.requirePayload(`${__dirname}/assets/invoices.json`);
const itemReceiptsPayload = tools.requirePayload(`${__dirname}/assets/item-receipts.json`);
const journalEntriesPayload = tools.requirePayload(`${__dirname}/assets/journal-entries.json`);
const payrollWagePayload = require('./assets/payroll-wage-items');
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);
const purchaseOrdersPayload = require('./assets/purchase-orders');
const salesOrdersPayload = require('./assets/sales-orders');
const salesReceiptsPayload = require('./assets/sales-receipts');
const vendorPayload = tools.requirePayload(`${__dirname}/assets/vendor.json`);

suite.forElement('finance', 'polling', null, (test) => {
  test.withApi('/hubs/finance/credit-memos').should.supportPolling(creditMemosPayload);
  test.withApi('/hubs/finance/customers').should.supportPolling(customersPayload);
  test.withApi('/hubs/finance/employees').should.supportPolling(employeesPayload);
  test.withApi('/hubs/finance/invoices').should.supportPolling(invoicesPayload);
  test.withApi('/hubs/finance/item-receipts').should.supportPolling(itemReceiptsPayload);
  test.withApi('/hubs/finance/journal-entries').should.supportPolling(journalEntriesPayload);
  test.withApi('/hubs/finance/payroll-wage-items').should.supportPolling(payrollWagePayload);
  test.withApi('/hubs/finance/products').should.supportPolling(productsPayload);
  test.withApi('/hubs/finance/purchase-orders').should.supportPolling(purchaseOrdersPayload);
  test.withApi('/hubs/finance/sales-orders').should.supportPolling(salesOrdersPayload);
  test.withApi('/hubs/finance/sales-receipts').should.supportPolling(salesReceiptsPayload);
  test.withApi('/hubs/finance/vendor').should.supportPolling(vendorPayload);
});
