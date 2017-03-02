'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const confirmEmailProp = (users) => {
  for (let i = 0; i < users.length; i++){
    if (users[i].email){
      return users[i];
    } else if (i === users.length -1){
      let user = users[i];
      user.email = tools.randomEmail();
      return user;
    }
  }
};

suite.forElement('crm', 'users', { skip: false}, (test) => {
    test.should.supportSr();
    test.should.supportPagination();
    it('should support PATCH for /hubs/crm/users/{id}', () => {
      let userPayload;
      return cloud.get(test.api)
        .then(r => userPayload = confirmEmailProp(r.body))
        .then(r => cloud.patch(`${test.api}/${userPayload.id}`, userPayload));
    });
    it('should support where for /hubs/crm/users', () => {
      let locationID;
      return cloud.get(test.api)
        .then(r => locationID = r.body[0].locationID)
        .then(r => cloud.withOptions({qs: {where: 'locationID=\'' + locationID + '\''}}).get(test.api));
    });
});
