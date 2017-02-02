'use strict';

const suite = require('core/suite');
const payload = require('./assets/envelopes');
const cloud = require('core/cloud');

suite.forElement('esignature', 'envelopes', { payload: payload }, (test) => {
  let documentId, agreementId;
  const opts = { formData: { body: JSON.stringify(payload) } };
  let statusPayload = {
    "value": "CANCEL"
  };

  it('should allow CRDS for /hubs/esignature/envelopes and sub-resources', () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions(opts).postFile(`${test.api}`, `${__dirname}/assets/attach.txt`))
      .then(r => agreementId = r.body.envelopeId)
      .then(r => cloud.get(`${test.api}/${agreementId}`))
      .then(r => cloud.get(`${test.api}/${agreementId}/documents`))
      .then(r => documentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${agreementId}/documents/${documentId}`))
      .then(r => cloud.get(`${test.api}/${agreementId}/signed-documents`))
      .then(r => cloud.put(`${test.api}/${agreementId}/status`, statusPayload));
  });
});