'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/users');
const cloud = require('core/cloud');
const options = {
  churros: {
    updatePayload: {
      "username": "Userguy2",
      "email": tools.randomEmail()
    }
  }
};
const updatePayload= {
      "name": "Userguy2",
      "email": tools.randomEmail()
    };

payload.email = tools.randomEmail();

suite.forElement('helpdesk', 'users', { payload:payload }, (test) => {
var id;
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  before(() => cloud.post(test.api, updatePayload)
    .then(r => id = r.body.id)); 

it(`should allow GET ${test.api}/groups`, () => {
   return cloud.get(`${test.api}/${id}/groups`);
});
after(() => cloud.delete(`${test.api}/${id}`));

});
