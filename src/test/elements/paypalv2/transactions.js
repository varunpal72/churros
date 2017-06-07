'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/sales');
const executePayload = require('./assets/execute');
const capturePayload = require('./assets/capture');
const expect = require('chakram').expect;
const logger = require('winston');

suite.forElement('payment', 'transactions', { payload: payload }, (test) => {
  it(`should allow R for ${test.api}, C for ${test.api}/:id/refund, and R for /refunds`, () => {
    let payerId, transactionId, paymentId, authUrl, time, refundId;
    return cloud.post('/payments', payload)
      .then(r => {
        expect(r.body.state).to.equal('created'); //if not "created" - we created a client payment
        paymentId = r.body.id;
        expect(r.body.links).to.not.be.empty;
        authUrl = r.body.links.filter(obj => obj.rel === 'approval_url' && obj.method === 'REDIRECT').map(obj => obj.href).toString();
        time = Date.now();
        logger.debug("Redirecting to %s to authorize the PayPal buyer.", authUrl);
      })
      .then(r => tools.runFile('paypalv2--sandbox', `${__dirname}/assets/authorizeBuyerScript.js`, authUrl))
      .then(r => {
        logger.debug("Url response from authorization: %s in (%s ms)", r, Date.now() - time);
        let params = r.split('?')[1];
        payerId = params.split('&').filter(param => param.toString().indexOf('PayerID') > -1).toString().split('=')[1];
        executePayload.payer_id = payerId;
      })
      .then(r => cloud.post(`/payments/${paymentId}/execute`, executePayload))
      .then(r => {
        expect(r.body.state).to.equal('approved');
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].sale).to.not.be.empty;
        transactionId = r.body.transactions[0].related_resources[0].sale.id;
      })
      .then(r => cloud.get(`${test.api}/${transactionId}`))
      .then(r => cloud.post(`${test.api}/${transactionId}/refund`, capturePayload))
      .then(r => refundId = r.body.id)
      .then(r => cloud.get(`/refunds/${refundId}`))
      .then(r => expect(r.body).to.not.be.empty);
  });
});