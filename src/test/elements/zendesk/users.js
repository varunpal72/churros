'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);
const updatePayload = tools.requirePayload(`${__dirname}/assets/usersUpdate.json`);
const cloud = require('core/cloud');
const options = {
  churros: {
    updatePayload: {
      "username": "Userguy2",
      "email": tools.randomEmail()
    }
  }
};

suite.forElement('helpdesk', 'users', { payload: payload }, (test) => {
  var id;
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  before(() => cloud.post(test.api, updatePayload)
    .then(r => id = r.body.id));
after(() => cloud.delete(`${test.api}/${id}`));
  it(`should allow GET ${test.api}/${id}/groups`, () => {
    return cloud.get(`${test.api}/${id}/groups`)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } })
        .get(test.api + '/' + id + '/groups'));
  });
});
