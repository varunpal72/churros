'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);
const invoicesPayload = require('./assets/invoices');
const journalEntriesPayload = require('./assets/journal-entries');
const paymentsPayload = require('./assets/payments');
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);
const purchaseOrdersPayload = require('./assets/purchase-orders');
const timeActivitiesPayload = require('./assets/time-activities');
const vendorPaymentsPayload = require('./assets/vendor-payments');
const vendorsPayload = tools.requirePayload(`${__dirname}/assets/vendors.json`);

// Polling not working right now, uncomment when fixed
suite.forElement('finance', 'polling', {skip: false}, (test) => {
  test.withApi('/hubs/finance/customers').should.supportPolling(customersPayload, 'customers');
  test.withApi('/hubs/finance/employees').should.supportPolling(employeesPayload, 'employees');
  test.withApi('/hubs/finance/invoices').should.supportPolling(invoicesPayload, 'invoices');
  test.withApi('/hubs/finance/journal-entries').should.supportPolling(journalEntriesPayload, 'journal-entries');
  test.withApi('/hubs/finance/payments').should.supportPolling(paymentsPayload, 'payments');
  test.withApi('/hubs/finance/products').should.supportPolling(productsPayload, 'products');
  test.withApi('/hubs/finance/purchase-orders').should.supportPolling(purchaseOrdersPayload, 'purchase-orders');
  test.withApi('/hubs/finance/time-activities').should.supportPolling(timeActivitiesPayload, 'time-activities');
  test.withApi('/hubs/finance/vendor-payments').should.supportPolling(vendorPaymentsPayload, 'vendor-payments');
  test.withApi('/hubs/finance/vendors').should.supportPolling(vendorsPayload, 'vendors');
});
