'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = chakram.expect;

const objects = {
  "ChurrosOrgObjectTestContact1235678": {
    "fields": [{
      "path": "Name",
      "type": "string"
    }]
  },
  "ChurrosOrgObjectTestAccount12334563657": {
    "fields": [{
      "path": "Id",
      "type": "string"
    }]
  }
};


suite.forPlatform('organizations/objects/definitions', { payload: objects }, (test) => {
  /** * Will delete all object definitions that are definied in the "objects" object above */
  const deleteEm = () => {
    const ignore = () => true;
    const promises = Object.keys(objects).map(objectName => cloud.delete(`/organizations/objects/${objectName}/definitions`, ignore));
    return Promise.all(promises);
  }

  /** * Safety first... */
  before(() => deleteEm());

  it('Should support creating object definitions', () => {
    return cloud.post('/organizations/objects/definitions', objects)
      // create a transformation that relies on one of the object definitions above
      // try to delete that object definition and validate 409
      // delete transformation
      // try to delete that object definition (just that one) and validate 200
      // celebrate
      .then(() => deleteEm());
  });
});
