'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');

let listId;
let accountId;
payload.EmailAddress = tools.randomEmail();

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
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
  
  it('Should perform CRUD)', () => {
    return cloud.post(`hubs/marketing/lists/${listId}/contacts`,payload)
    .then(r=>{
      var email = r.body.EmailAddress;
      return cloud.get(`hubs/marketing/lists/${listId}/contacts/${email}`).then(r=>{
        return cloud.patch(`hubs/marketing/lists/${listId}/contacts/${email}`, payload)
        .then(r=>{
          return cloud.delete(`hubs/marketing/lists/${listId}/contacts/${email}`)
        })
      })
    })
  })
});
