'use strict';

const suite = require('core/suite');
const payload = require('./assets/designs');
const cloud = require('core/cloud');

suite.forElement('general', 'designs', { payload: payload }, (test) => {
  it(`should allow CR for /hubs/general/desings`, () => {
    let designId;
    return cloud.post(`${test.api}`, payload)
      .then(r => designId = r.body.id)
      .then(r => cloud.get(`${test.api}/${designId}`));
  });
});