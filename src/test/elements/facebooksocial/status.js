'use strict';

const suite = require('core/suite');
const payload = require('./assets/status');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const statusPayload = build({ message: tools.random() });

suite.forElement('social', 'status', { payload:statusPayload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
it.skip(`should support US for ${test.api}/{id}/comments`, () => {
   let id;
   return cloud.post(test.api,statusPayload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/comments`, statusPayload))
      .then(r => cloud.post(`${test.api}/${id}/like`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
