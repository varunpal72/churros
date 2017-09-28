'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/sales');
const executePayload = require('./assets/execute');
const expect = require('chakram').expect;
const logger = require('winston');

let updatePayload = {
  "op": "replace",
  "path": "/transactions/0/item_list/shipping_address",
  "value": {
    "city": "SAn Jose",
    "country_code": "US",
    "line1": "4thFloor",
    "line2": "unit#34",
    "phone": "011862212345678",
    "postal_code": "95131",
    "recipient_name": "Hello World",
    "state": "CA"
  }
};

suite.forElement('payment', 'payments', { payload: payload }, (test) => {
  it(`should allow CRUS ${test.api} and C ${test.api}/:id/execute`, () => {
    let payerId, paymentId, authUrl, time;
    return cloud.post(test.api, payload)
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
      .then(r => cloud.get(`${test.api}/${paymentId}`))
      .then(r => cloud.withOptions({ qs: { pageSize: 10 }}).get(test.api))  //fetching 10 b/c that's PayPals max page size
      .then(r => cloud.patch(`${test.api}/${paymentId}`, updatePayload))
      .then(r => cloud.post(`${test.api}/${paymentId}/execute`, executePayload))
      .then(r => expect(r.body.state).to.equal('approved'));
  });
  test.should.supportPagination('id');
  let dateFourHoursBack = new Date(Date.now() - (4 * (36) * (100000))).toISOString();
  test
    .withName(`should support Ceql search for ${test.api} by start_time`)
    .withOptions({ qs: { where: `start_time='${dateFourHoursBack}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.create_time >= dateFourHoursBack);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
