'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');
let listId;
let accountId;

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

   beforeEach(()=>{
     return cloud.get('/hubs/marketing/accounts')
     .then(r=> accountId = r.body[0].id)
     .then(r=>{
       return cloud.withOptions(({qs:{where:"id ="+ "'"+accountId+"'"}})).get('hubs/marketing/lists')
     })
     .then(r=> listId = r.body[0].id)
  });
  
  it('Should perform CRD)', () => {
    //add id of list to ListIDs array
    payload.ListIDs.push(listId);
    return cloud.withOptions(({qs:{where:"id ="+ "'"+accountId+"'"}})).post('hubs/marketing/campaigns',payload)
    .then(r=>{
      var campaingID = r.body.id
      return cloud.get('hubs/marketing/campaigns/'+campaingID)
        .then(r=>{
          return cloud.delete('hubs/marketing/campaigns/'+campaingID)
        })
      
    })
    //console.log(accountId)
  });
});
