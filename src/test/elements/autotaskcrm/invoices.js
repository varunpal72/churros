'use strict';

const suite = require('core/suite');
const payload = require('./assets/salesOrders');
const cloud = require('core/cloud');

suite.forElement('crm', 'invoices', (test) => {
  test.should.supportSr();
  it('should allow PATCH on ' + test.api + '/{id}', () => {
    let oldInvoiceNumber = "";
    let testInvoiceNumber = "555555";
    let pass = false;
    return cloud.get(test.api)
      .then(r => r.body[0])
      .then(invoice => {
        if (invoice.invoiceNumber){
          oldInvoiceNumber = invoice.invoiceNumber;
        }
        return cloud.patch(`${test.api}/${invoice.id}`, {"invoiceNumber": testInvoiceNumber});
      })
      .then(r => r.body)
      .then(updatedInvoice => {
        if (updatedInvoice.invoiceNumber === testInvoiceNumber){
          pass = true;
        }
        cloud.patch(`${test.api}/${updatedInvoice.id}`, {"invoiceNumber": oldInvoiceNumber});
        return pass;
      });
  });
  test.withOptions({ qs: { where: 'accountID=\'29683561\'' }, skip: false }).should.return200OnGet();
  test.should.supportPagination();
});
