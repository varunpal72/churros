const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const paymentPayload = tools.requirePayload(`${__dirname}/assets/payment.json`);
//const paymentUpdatePayload = tools.requirePayload(`${__dirname}/assets/paymentUpdate.json`);

suite.forElement('employee', 'payments', (test) => {

before(() => {
    return cloud.get('/users')
      .then(r => {
        paymentPayload.created_by = r.body[0].resource_uri;
        paymentPayload.updated_by = r.body[0].resource_uri;

      })
      .then(r => cloud.get('/payments'))
      .then(r => paymentPayload.station = r.body[0].station)
      .then(r => cloud.get('/locations')
        .then(r => paymentPayload.establishment = r.body[0].resource_uri))
      .then(r => {
        var utcDate = new Date(new Date().toUTCString());
        utcDate.setHours(utcDate.getHours() + 5);
        let pDate = utcDate.toISOString().split('.')[0];
        paymentPayload.payment_date = pDate;
      });
  });

  it('Should allow SR for payments', () => {
    let paymentId, len;
    return cloud.get(test.api)
      .then(r => {
        len = r.body.length;
        paymentId = r.body[len - 1].id;
      })
      .then(r => cloud.get(`${test.api}/${paymentId}`));
  });
});
