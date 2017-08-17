'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/messages.json`);

suite.forElement('social', 'messages', { payload: payload }, (test) => {
  let messageId;
  it(`should allow GET for ${test.api}`, () => {
    return cloud.withOptions({ qs: { where: 'startTime=\'2017-06-01\' and endTime=\'2017-06-27\' ' } }).get(`${test.api}`)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => messageId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${messageId}`))
      .then(r => cloud.delete(`${test.api}/${messageId}`));
  });
  test.withOptions({ qs: { where: 'startTime=\'2017-06-01\' and endTime=\'2017-06-27\' ' } }).should.supportPagination();
});
