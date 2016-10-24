'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const tools = require('core/tools');
const cloud = require('core/cloud');
const chakram = require('chakram');

suite.forElement('social', 'lists', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  //test.should.supportPagination();
  //test.should.return200OnGet();//getAll
  const name = "test"+tools.random();
  const options = {
    churros: {
      updatePayload: {
        "name": "test"
      }
    }
  };
  // cloud.post(test.api,payload).then(r => productId = r.body.id_str);
    //test.withOptions({ qs: {name: name }}).should.return200OnPost();
   //let response = chakram.post(test.api, payload);
  //cloud.post(test.api,payload).then(r => productId = r.body.id_str);
//  test.should.supportSr();
//test.should.return200OnPost()
//  test.should.supportCrd();
//  cloud.post(test.api, payload);
  //test.withOptions(options).should.supportCruds();
//test.should.supportSr();
const build = (overrides) => Object.assign({}, payload, overrides);
const updatePayload = build({ "name": tools.random()});
it('should support CRUDS for /hubs/social/lists/{id}/subscribers', () => {
  let listId;
  return cloud.post(test.api, payload)
   .then(r => listId = r.body.id_str)
   .then(r => cloud.put(`${test.api}/${listId}`,updatePayload))
   .then(r => cloud.get(`${test.api}/${listId}/subscribers`))
   //.then(r => cloud.delete(`${test.api}/${listId}/subscribers`))
   //.then(r => cloud.delete(`${test.api}/${listId}`))
   //.then(r => cloud.delete(`${test.api}/${listId}`))
})
  //it(‘should support CRUDS for list/{id}/subscriptions’, () => {})
  //test.withOptions({ qs: { name:name } }).should.supportCrd();
    //.then(r => cloud.get(`${test.api}?id=${productId}`))
    //.then(r => cloud.patch(`${test.api}/${productId}?name=${"test"}`))
    //.then(r => cloud.delete(`${test.api}/${productId}`))
    //.then(r => cloud.withOptions({ qs: { listId: productId } }).post('/hubs/social/lists/subscribers', listId))
    //.then(r => userId = r.body.user.id_str)
    //.then(r => cloud.get(`${test.api}/${userId}?listId=${productId}`));
    //.then(r => cloud.delete(`${test.api}/${productId}/subscribers`));
});
