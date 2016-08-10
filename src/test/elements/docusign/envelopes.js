'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const createPayload = require('./assets/envelopes.create.json');
const updatePayload = require('./assets/envelopes.update.json');
const schema = require('./assets/envelope.schema.json');
const envelopesSchema = require('./assets/envelopes.schema.json');
const documentsSchema = require('./assets/documents.schema.json');

suite.forElement('esignature', 'envelopes', (test) => {
  it('should allow creating an envelope, retrieving the created envelope and updating the envelope status', () => {
    let envelopeId = "-1";
    let path = __dirname + '/assets/MrRobotPdf.pdf';

    const opts = { formData: { envelope: JSON.stringify(createPayload) } };

    return cloud.withOptions(opts).postFile(test.api, path)
      .then(r => envelopeId = r.body.envelopeId)
      .then(r => cloud.get(test.api + '/' + envelopeId, (r) => expect(r).to.have.schemaAnd200(schema)))
      .then(r => cloud.patch(test.api + '/' + envelopeId, updatePayload, (r) => expect(r).to.have.statusCode(200)));
  });

  it('should allow creating an envelope, retrieving the created envelope\'s document(s)', () => {
    let envelopeId = "-1";
    let path = __dirname + '/assets/MrRobotPdf.pdf';
    const opts = { formData: { envelope: JSON.stringify(createPayload) } };

    return cloud.withOptions(opts).postFile(test.api, path)
      .then(r => envelopeId = r.body.envelopeId)
      .then(r => cloud.get(test.api + '/' + envelopeId + '/documents',
        (r) => expect(r).to.have.schemaAnd200(documentsSchema)));
  });

  test.withValidation(envelopesSchema)
    .withOptions({ qs: { where: 'from_date=\'2015-01-01T00:00:00Z\'' } })
    .should
    .return200OnGet();
});
