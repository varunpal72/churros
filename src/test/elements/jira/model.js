'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const model = require('core/model');

suite.forElement('helpdesk', 'model', (test) => {

    it('should allow model vallidation for /hubs/helpdesk/agents', () => {
       return cloud.withOptions({qs:{where:`username='jiradev'`}}).get('/hubs/helpdesk/agents')
       .then(r => model.validateResponseModel(r, 'getAgents'))
       .then(r =>cloud.withOptions({qs:{where:`username='jiradev'`, page: 1, pageSize: 1 }}).get(`/hubs/helpdesk/agents/${r.body[0].key}`))
       .then(r => model.validateResponseModel(r, 'getAgentById'));
     });
     
    //  it('should allow model vallidation for /hubs/marketing/contacts', () => {
    //     return cloud.get(`/hubs/marketing/contacts`)
    //     .then(r => model.validateResponseModel(r, 'getContacts'))
    //     .then(r => cloud.get(`/hubs/marketing/contacts/${r.body[0].id}`))
    //     .then(r => model.validateResponseModel(r, 'getContactById'));
    //   });
    //   it('should allow model vallidation for /hubs/marketing/campaigns', () => {
    //      return cloud.get(`/hubs/marketing/campaigns`)
    //      .then(r => model.validateResponseModel(r, 'getCampaigns'))
    //      .then(r => cloud.get(`/hubs/marketing/campaigns/${r.body[0].id}`))
    //      .then(r => model.validateResponseModel(r, 'getCampaignById'));
    //    });

});
