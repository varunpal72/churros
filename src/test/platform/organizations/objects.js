'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const chakram = require('chakram');

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

const transformation = {
  "ChurrosOrgObjectTestContact1235678": {
    "level": "organization",
    "vendorName": "Contact",
    "startDate": "2017-01-03 18:15:08.496059",
    "fields": [
      {
        "path": "MyID",
        "vendorPath": "AccountId"
      },
      {
        "path": "MyEmail",
        "vendorPath": "Email"
      },
      {
        "path": "MyFirstName",
        "vendorPath": "FirstName"
      },
      {
        "path": "MyLastName",
        "vendorPath": "LastName"
      },
      {
        "path": "MyPhone",
        "vendorPath": "Phone"
      }
    ],
    "configuration": [
      {
        "type": "passThrough",
        "properties": {
          "fromVendor": false,
          "toVendor": false
        }
      }
    ],
    "isLegacy": false
  }
};


suite.forPlatform('organizations/objects/definitions', { payload: objects }, (test) => {
  /** * Will delete all object definitions that are definied in the "objects" object above */
  const deleteEm = () => {
    const ignore = () => true;
    const promises = Object.keys(objects).map(objectName => cloud.delete(`/organizations/objects/${objectName}/definitions`, ignore));
    return Promise.all(promises);
  };

  /** * Safety first... */
  before(() => deleteEm());

  it('Should throw a 409 when associated transformations exist on one or more object definitions', () => {
    return cloud.post('/organizations/objects/definitions', objects)
      //create a transformation
      .then(r => cloud.post(`/organizations/elements/sfdc/transformations/ChurrosOrgObjectTestContact1235678`,transformation,true))
      //run the delete test for organizations/objects/definitions, return false if anything but 409 is returned
      .then(() => cloud.delete(test.api, (r) => {
        if(r.statusCode===409){
          return true;
        } else {
          return false;
        }
      }))
      //delete the created transformation
      .then(() => cloud.delete(`/organizations/elements/sfdc/transformations/ChurrosOrgObjectTestContact1235678`,true))
      //clean up the created objects
      .then(() => deleteEm());
  });
});
