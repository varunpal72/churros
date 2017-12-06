'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const model = require('core/model');

suite.forElement('helpdesk', 'model', (test) => {
  it.skip('should allow model vallidation for accounts', () => {
     return cloud.get("/hubs/helpdesk/accounts")
     .then(r => model.validateResponseModel(r, 'getAccounts'))
   });

   it('should allow model vallidation for incidents', () => {
      return cloud.get("/hubs/helpdesk/incidents")
      .then(r => model.validateResponseModel(r, 'getIncidents'))
    });
    it('should allow model vallidation for contacts', () => {
       return cloud.get("/hubs/helpdesk/contacts")
       .then(r => model.validateResponseModel(r, 'getContacts'))
    });
});
