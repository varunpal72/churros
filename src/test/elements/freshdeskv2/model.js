'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const model = require('core/model');

suite.forElement('helpdesk', 'model', (test) => {
  let body;
  it.skip('should allow model vallidation for accounts', () => {
     return cloud.get("/hubs/helpdesk/accounts")
     .then(r => model.validateResponseModel(r, 'getAccounts'))
     .then(r => id = r.body[0].id )
     .then(r =>cloud.get(`/hubs/helpdesk/accounts/${id}`))
     .then(r => model.validateResponseModel(r, 'getIncidentByAccountId'));
    });

  //  it('should allow model vallidation for incidents', () => {
  //     return cloud.withOptions({ qs: { pageSize: 1 } }).get(`/hubs/helpdesk/incidents/`)
  //     .then(r => model.validateResponseModel(r, 'getIncidents'))
  //     .then(r =>cloud.get(`/hubs/helpdesk/incidents/${r.body.id}`))
  //     .then(r => model.validateResponseModel(r, 'getIncidentByIncidentsId'));
  //   });

    it('should allow model vallidation for incidents', () => {
       return cloud.get(`/hubs/helpdesk/incidents`)
       .then(r => model.validateResponseModel(r, 'getIncidents'))
       .then(r =>cloud.get(`/hubs/helpdesk/incidents/${r.body[0].id}`))
       .then(r => model.validateResponseModel(r, 'getIncidentById'));
     });


    it.skip('should allow model vallidation for contacts', () => {
       return cloud.get("/hubs/helpdesk/contacts")
       .then(r => model.validateResponseModel(r, 'getContacts'))
    });


});
