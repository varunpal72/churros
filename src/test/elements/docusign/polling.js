'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const createPayload = require('./assets/envelopes.create.json');
let path = __dirname + '/assets/MrRobotPdf.pdf';
const opts = { formData: { envelope: JSON.stringify(createPayload) } };
const envelopeCreate = (r) => cloud.withOptions(opts).postFile('/hubs/esignature/envelopes', r);

suite.forElement('esignature', 'polling', (test) => {
  test.withApi('/hubs/esignature/envelopes').should.supportPolling(path, 'envelopes', envelopeCreate);
});
