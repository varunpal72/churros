'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const propertiesPayload = require('./assets/contactsProperties');
const tools = require('core/tools');
const options = {
  churros: {
    updatePayload: {
        "firstName": tools.random(),
        "lastName": tools.random()
    }
  }
};
const propertygroups = {
    "displayName": "test_churros_1",
    "displayOrder": 0,
    "name": "test12"
  };
  const updatePropertygroups = {
  "displayName": "test_churros1",
  "displayOrder": 0,
  "name": "test12"
  };
  const fieldsUpdate = {
  "favoritedOrder": -1,
  "hidden": false,
  "mutableDefinitionNotDeletable": false,
  "displayOrder": -1,
  "description": "The country reported by a contact's IP address. This is automatically set by HubSpot and can be used for segmentation and reporting.",
  "label": "IP Country",
  "type": "string",
  "readOnlyDefinition": false,
  "formField": false,
  "displayMode": "current_value",
  "groupName": "conversioninformation",
  "name": "chuors_temp_1",
  "options": [],
  "fieldType": "text",
  "calculated": false,
  "externalOptions": false,
  "favorited": false
};
suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  it('should allow CRUD for hubs/marketing/contacts/properties', () => {
    let id;
    return cloud.post(`${test.api}/properties`,propertiesPayload)
     .then(r => id = r.body.name)
     .then(r => cloud.get(`${test.api}/properties`))
     .then(r => cloud.get(`${test.api}/properties/${id}`))
     .then(r => cloud.patch(`${test.api}/properties/${id}`,fieldsUpdate))
     .then(r => cloud.delete(`${test.api}/properties/${id}`));
   });
  it('should allow CRUD for hubs/marketing/contacts/propertygroups', () => {
  let id;
  return cloud.post(`${test.api}/propertygroups`,propertygroups)
   .then(r => id = r.body.name)
   .then(r => cloud.get(`${test.api}/propertygroups`))
   .then(r => cloud.get(`${test.api}/propertygroups/${id}`))
   .then(r => cloud.patch(`${test.api}/propertygroups/${id}`,updatePropertygroups))
   .then(r => cloud.delete(`${test.api}/propertygroups/${id}`));
  });
});
