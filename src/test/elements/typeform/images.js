'use strict';

const suite = require('core/suite');
const payload = require('./assets/images');
const cloud = require('core/cloud');

suite.forElement('general', 'images', { payload: payload }, (test) => {
    it(`should allow CR for /hubs/general/images`, () => {
    let imageId;
    return cloud.post(`${test.api}`, payload)
      .then(r => imageId = r.body.id)
      .then(r => cloud.get(`${test.api}/${imageId}`));
    });
});
