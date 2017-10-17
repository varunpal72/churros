'use strict';

const suite = require('core/suite');
const leadsPayload = require('./assets/leads');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = {
  "name": "Name for Program Test" + tools.random(),
  "channel": "Email Send",
  "type": "Email",
  "folder": {
    "type":"Folder",
    "id":33
  }
};

suite.forElement('marketing', 'programs', { payload: payload }, (test) => {
  it('should allow C for programs/{programId}/leads', () => {
    let program
    // let programId;
    // let programName;
    leadsPayload.email = "sampleTestName" + tools.random() + "@test.com";
    return cloud.post(test.api, payload)
      .then(r => program = r.body[0])
      .then(r => cloud.post(`${test.api}/${program.name}/sync`, leadsPayload))
      .then(r => cloud.delete(`${test.api}/${program.id}`));
  });
});


