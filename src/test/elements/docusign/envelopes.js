'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const createPayload = require('./assets/envelopes.create.json');
const updatePayload = require('./assets/envelopes.update.json');
const schema = require('./assets/envelope.schema.json');
const envelopesSchema = require('./assets/envelopes.schema.json');
const documentsSchema = require('./assets/documents.schema.json');
const recipient = require('./assets/envelopes.recipient.json');
const tab = require('./assets/recipients.tab.json');

suite.forElement('esignature', 'envelopes', (test) => {
  it('should allow creating an envelope, retrieving the created envelope, updating the envelope status and retrieving the custom fields of the envelope', () => {
    let envelopeId = "-1";
    let path = __dirname + '/assets/MrRobotPdf.pdf';

    const opts = { formData: { envelope: JSON.stringify(createPayload) } };

    return cloud.withOptions(opts).postFile(test.api, path)
      .then(r => envelopeId = r.body.envelopeId)
      .then(r => cloud.get(test.api + '/' + envelopeId, (r) => expect(r).to.have.schemaAnd200(schema)))
      .then(r => cloud.patch(test.api + '/' + envelopeId, updatePayload, (r) => expect(r).to.have.statusCode(200)));
    //.then(r => cloud.get(`${test.api}/${envelopeId}/custom_fields`));
  });

  it('should allow creating an envelope, retrieving the created envelope\'s document(s)', () => {
    let envelopeId = "-1";
    let path = __dirname + '/assets/MrRobotPdf.pdf';
    const opts = { formData: { envelope: JSON.stringify(createPayload) } };
    let documentId;

    return cloud.withOptions(opts).postFile(test.api, path)
      .then(r => envelopeId = r.body.envelopeId)
      .then(r => cloud.get(test.api + '/' + envelopeId + '/documents',
        (r) => expect(r).to.have.schemaAnd200(documentsSchema)))
      .then(r => documentId = r.body[0].documentId)
      .then(r => cloud.get(`${test.api}/${envelopeId}/documents/${documentId}`));
  });

  it('should get all envelopes, find one which is sent and then find its certifiates', () => {
    let envelopeId;

    return cloud.withOptions({ qs: { where: 'from_date=\'2015-01-01T00:00:00Z\'' } }).get(test.api)
      .then(r => envelopeId = r.body.filter(function(el) {
        return el.status === 'sent';
      })[0].envelopeId)
      .then(r => cloud.get(`${test.api}/${envelopeId}/documents/certificates`));
  });

  it('should create recipients for envelopes and also tabs for recipients', () => {
    let envelopeId = "-1";
    let path = __dirname + '/assets/MrRobotPdf.pdf';
    const opts = { formData: { envelope: JSON.stringify(createPayload) } };

    return cloud.withOptions(opts).postFile(test.api, path)
      .then(r => envelopeId = r.body.envelopeId)
      .then(r => cloud.post(`${test.api}/${envelopeId}/recipients`, recipient))
      .then(r => cloud.post(`${test.api}/${envelopeId}/recipients/${recipient.agents[0].recipientId}/tabs`, tab));
  });

  test.withValidation(envelopesSchema)
    .withOptions({ qs: { where: 'from_date=\'2015-01-01T00:00:00Z\'' } })
    .should
    .return200OnGet();
});
