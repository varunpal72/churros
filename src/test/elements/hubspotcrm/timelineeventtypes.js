'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/timelineeventtypes');

suite.forElement('crm', 'timelineeventtypes', (test) => {

  it('should test CRUD for /timelineeventtypes', () => {
    let id;
    return cloud.get(test.api)
      .then(r => cloud.post(test.api, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.put(`${test.api}/${id}`, payload))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

});
