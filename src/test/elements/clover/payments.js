const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const paymentPayload = tools.requirePayload(`${__dirname}/assets/payments.json`);

suite.forElement('employee', 'payments', (test) => {

  test.withValidation(r => {
    expect(r).to.have.statusCode(200);
    if (r.body !== null || r.body !== undefined) {
      expect(r.body[0].id).to.not.be.empty;
    }
  }).should.supportSr();

  it('Should support CRS for payments', () => {
    let pId;
    return cloud.post(test.api, paymentPayload)
      .then(r => pId = r.body.paymentId)
      .then(r => cloud.get(`${test.api}/${pId}`))
      .then(r => cloud.get(test.api))
      .then(r => expect(r.body).to.not.to.be.empty);
  });
});
