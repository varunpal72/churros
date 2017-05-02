'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const cloud = require('core/cloud');
let accountId;

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  
  
  beforeEach(()=>{
     return cloud.get('/hubs/marketing/accounts')
     .then(r=> accountId = r.body[0].id)
  });
  
  it('Should perform CRUD)', () => {
    return cloud.withOptions(({qs:{where:"id ="+ "'"+accountId+"'"}})).post('hubs/marketing/lists',payload)
    .then(r=>{
      var listID = r.body.id
      return cloud.get('hubs/marketing/lists/'+listID).then(r=>{
        return cloud.patch('hubs/marketing/lists/'+listID, payload)
        .then(r=>{
          return cloud.delete('hubs/marketing/lists/'+listID)
        })
      })
    })
    //console.log(accountId)
  });
 //test.withOptions({qs:{where:"id ="+ "'"+accountId+"'"}}).should.supportCrud()
});
