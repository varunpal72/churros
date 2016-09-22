'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const customerPayload = require('./assets/customers');

const assetPayload = (locationId) => (
{
  "name": "Asset001",
  "description": "Description of the asset",
  "serialNumber": "WS23",
  "make": "Maker001",
  "model": "Model-YT23",
  "manufacturer": "Bosh",
  "manufacturerNotes": "Havy duty drill",
  "maintenanceNotes": "Maintenance notes of the asset",
  "area": "2nd shelf, storage id U345",
  "arrivedOn": "2014-01-01",
  "location" : {
    "uuid" : locationId
  }
});

suite.forElement('fsa', 'assets', null, (test) => {
  it('should allow CRUDS for assets', () => {
    let locationId, customerId;
    let httpElement;
    return cloud.post('/hubs/fsa/customers', customerPayload)
      .then(r => httpElement = r.body)
      .then(r => customerId = httpElement.id)
      .then(r => locationId = httpElement.location.uuid)
      .then(r => cloud.cruds(`/hubs/fsa/assets`, assetPayload(locationId)))
      .then(r => cloud.delete(`/hubs/fsa/customers/${customerId}`));
  });
});
