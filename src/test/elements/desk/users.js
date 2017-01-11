'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');

suite.forElement('helpdesk', 'users', (test) => {
  test.should.supportSr();
  test.should.supportPagination();

  it('should get all users and then update the name of the first user', () => {
    let userId;
    const oldPassword = props.getOptionalForKey("desk", "password");
    const newPassword = oldPassword + '1';

    return cloud.get(test.api)
      .then(r => userId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.patch(`${test.api}/${userId}`, { current_password: oldPassword, password: newPassword }))
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.patch(`${test.api}/${userId}`, { current_password: newPassword, password: oldPassword }));
  });
});
