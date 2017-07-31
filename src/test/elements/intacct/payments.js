 const suite = require('core/suite');
  const cloud = require('core/cloud');
  const tools = require('core/tools');
  const CustomerPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
  const InvoicePayload = tools.requirePayload(`${__dirname}/assets/invoices.json`);
  const payload = tools.requirePayload(`${__dirname}/assets/payments.json`);
  const payloadApply = require('./assets/payments-apply');

  suite.forElement('finance', 'payments', { payload: payload,skip: true}, (test) => {
    let customerId, invoiceKey, arpaymentkey;
    it(`should allow CRS for ${test.api}`, () => {
      return cloud.crs(test.api, payload);
    });
    test.should.supportPagination();
    test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
    it(`should allow C for ${test.api}/{id}/apply`, () => { //since it have no delete support
      return cloud.post('/hubs/finance/customers', CustomerPayload)
        .then(r => {
          customerId = r.body.id;
          payload.customerid = customerId;
          InvoicePayload.customerid=customerId;
        })
        .then(r => cloud.post('/hubs/finance/invoices', InvoicePayload))
        .then(r => invoiceKey = r.body.id)
        .then(r => cloud.post(test.api, payload))
        .then(r => {
          arpaymentkey = r.body.id;
          arpaymentkey=parseInt(arpaymentkey);
          payloadApply.arpaymentkey = arpaymentkey;
          payloadApply.arpaymentitems.arpaymentitem.invoicekey = invoiceKey;
        })
        .then(r => cloud.post(`${test.api}/${arpaymentkey}/apply`,payloadApply));
        //.then(r => cloud.delete(`hubs/finance/invoices/${invoiceKey}`)) //Transaction  is already paid and can't be deleted.
      //  .then(r => cloud.delete(`hubs/finance/customers/${customerId}`));//Another area of the system references
    });
  });
