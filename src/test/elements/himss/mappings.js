'use strict';

const suite = require('core/suite');
const payload = require('./assets/mappings');
const cloud = require('core/cloud');
const projectId = "v3g8sm3df8yt06m4z284cfy8ydyu16lg";

suite.forElement('general', 'mappings', { payload: payload, skip: true }, (test) => {
  it('should allow POST, DELETE /mappings and DELETE /mappings/{id}', () => {
    return cloud.post(test.api, payload)
      .then(r => cloud.delete(`${test.api}/${projectId}`))
      .then(r => cloud.delete(test.api));

  });
});
