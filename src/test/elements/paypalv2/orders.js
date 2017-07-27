'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/orders.json`);
const payloadToAuthorize = tools.requirePayload(`${__dirname}/assets/orders.json`);
const executePayload = require('./assets/execute');
const capturePayload = require('./assets/capture');
const expect = require('chakram').expect;
const logger = require('winston');

suite.forElement('payment', 'orders', { payload: payload }, (test) => {
  it(`should allow C /payments, C /payments/:id/execute, RD for ${test.api}`, () => {
    let payerId, orderId, paymentId, authUrl, time;
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
        expect(r.body.transactions[0].related_resources[0].order).to.not.be.empty;
        orderId = r.body.transactions[0].related_resources[0].order.id;
      })
      .then(r => cloud.get(`${test.api}/${orderId}`))
      .then(r => expect(r.body.state).to.equal('PENDING'))
      .then(r => cloud.delete(`${test.api}/${orderId}`))
      .then(r => expect(r.body.state).to.equal('voided'));
  });

  it(`should allow U for ${test.api}/:id/authorize and C for ${test.api}/:id/capture`, () => {
    let payerId, orderId, paymentId, authUrl, time;
    return cloud.post('/payments', payloadToAuthorize)
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
        expect(r.body.transactions[0].related_resources[0].order).to.not.be.empty;
        orderId = r.body.transactions[0].related_resources[0].order.id;
      })
      .then(r => cloud.patch(`${test.api}/${orderId}/authorize`, capturePayload))
      .then(r => expect(r.body.state).to.equal('authorized'))
      .then(r => cloud.post(`${test.api}/${orderId}/capture`, capturePayload))
      .then(r => expect(r.body.state).to.equal('completed'));
  });
});
