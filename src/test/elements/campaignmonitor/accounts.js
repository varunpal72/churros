'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/accounts');
const cloud = require('core/cloud');

payload.CompanyName = tools.random();

suite.forElement('marketing', 'accounts', { payload: payload }, (test) => {
let clientId;
    it('should support CRD', ()=>{
        return cloud.post('/hubs/marketing/accounts', payload)
        .then(r=>{
            clientId = r.body.BasicDetails.ClientID
            return cloud.get('/hubs/marketing/accounts/'+clientId)
        })
        .then(r=>{
            return cloud.delete('/hubs/marketing/accounts/'+clientId);
        })
    })
  //test.should.supportCrd()
});
