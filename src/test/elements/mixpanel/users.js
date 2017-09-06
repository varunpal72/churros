'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/users');


suite.forElement('general', 'users', { payload: payload }, (test) => {
  it('should allow CUDS for /users', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.$distinct_id)
      .then(r => cloud.patch(`${test.api}/${id}`, payload))
      .then(r => cloud.withOptions({ qs: { where: `"$city"='Dallas'` } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: `query = '(properties[\"$city\"] == \"Dallas\")'` } }).get(`${test.api}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
