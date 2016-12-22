'use strict';

const suite = require('core/suite');
const payload = require('./assets/agreements');
const cloud = require('core/cloud');

suite.forElement('esignature', 'agreements', { payload: payload }, (test) => {
  let date = new Date();
  let startIndex = 0;
  let documentId;
  let endIndex = 19;
  let agreementId;
  let currentDate = date.toISOString().substring(startIndex, endIndex);
  let startDate = date.setDate(date.getDate() - 10);
  let oldDate = new Date(startDate);
  let statusPayload = {
    "value": "CANCEL"
  };
  startDate = oldDate.toISOString().substring(startIndex, endIndex);

  it('should allow GET for /hubs/esignature/agreements', () => {
    return cloud.withOptions({ qs: { where: `startDate = '${startDate}' and endDate = '${currentDate}'` } }).get(`/hubs/esignature/agreement-asset-events `)
      .then(r => cloud.postFile(`/hubs/esignature/transient-documents`, `${__dirname}/assets/attach.txt`))
      .then(r => payload.documentCreationInfo.fileInfos[0].transientDocumentId = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => agreementId = r.body.agreementId)
      .then(r => cloud.get(`${test.api}/${agreementId}`))
      .then(r => cloud.get(`${test.api}/${agreementId}/documents`))
      .then(r => documentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${agreementId}/documents/${documentId}`))
      .then(r => cloud.get(`${test.api}/${agreementId}/signed-documents`))
      .then(r => cloud.put(`${test.api}/${agreementId}/status`, statusPayload))
      .then(r => cloud.delete(`${test.api}/${agreementId}`));

  });

});
