'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/media.json`);

suite.forElement('social', 'media', (test) => {
  let id;
  it.skip(`should allow POST and GET by :id for ${test.api}`, () => {
    return cloud.post(`${test.api}`, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}`));
  });
});
