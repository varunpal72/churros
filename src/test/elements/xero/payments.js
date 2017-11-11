'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const expect = require('chakram').expect;
const random = require('core/tools.js').randomStr;


suite.forElement('finance', 'payments', (test) => {
    it(`should support CRS for /payments`, () => {
        const contactWrap = (invoiceWrap) => {
            let contactId, contactName;
            let contactPayload = require('./assets/contact.json');    
            contactPayload.Name = 'churros-Customer-' + random('1234567890abcdefghij', 6);
            return cloud.post('/customers', contactPayload)
                .then(r => {
                    expect(r.body.Name).to.equal(contactPayload.Name);
                    contactId = r.body.ContactID;
                    contactName = r.body.Name;
                })
                .then(() => invoiceWrap(contactName))
                .then(() => cloud.delete(`/customers/${contactId}`));
        };

        const cb = (contactName) => {

            const makePayment = (invoiceId) => {
                const bankAccountName = 'ToBank-DoNotDelete';
                let paymentPayload = require('./assets/payment.json');
                let accountId;
                return cloud.withOptions({qs: {where: `Name='${bankAccountName}'`}}).get('/ledger-accounts') 
                    .then(r => {
                        expect(r.body.length).to.equal(1);
                        expect(r.body[0].Name).to.equal(bankAccountName);
                        accountId = r.body[0].AccountID;
                    })
                    .then(() => {
                        paymentPayload.Account.AccountID = accountId;
                        paymentPayload.Invoice.InvoiceID = invoiceId;
                    })
                    .then(() => cloud.post(`${test.api}`, paymentPayload))
                    .then(r => cloud.get(`${test.api}/${r.body.PaymentID}`))
                    .then(r => cloud.get(`${test.api}`));
            }


            let invoiceId;
            let invoicePayload = require('./assets/invoice.json');
            invoicePayload.Contact.Name = contactName;
            return cloud.post('/invoices', invoicePayload)
                .then(r => {
                    expect(r.body).to.not.be.empty;
                    invoiceId = r.body.InvoiceID;
                })
                .then(() => makePayment(invoiceId));
        }


        return contactWrap(cb);
    });


});