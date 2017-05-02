'use strict';

const suite = require('core/suite');
const payload = require('./assets/segments');

const cloud = require('core/cloud');
const tools = require('core/tools');

let listId;
let accountId;
payload.Title = tools.random();

suite.forElement('marketing', 'segments', { payload: payload }, (test) => {
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
    payload.ListID = listId;
    
    return cloud.post(`hubs/marketing/segments`,payload)
    .then(r=>{
      var segmentId = r.body.id;
      return cloud.get(`hubs/marketing/segments/${segmentId}`).then(r=>{
        delete payload.ListID
        return cloud.patch(`hubs/marketing/segments/${segmentId}`, payload)
        .then(r=>{
          return cloud.delete(`hubs/marketing/segments/${segmentId}`)
        })
      })
    })
  })
});
