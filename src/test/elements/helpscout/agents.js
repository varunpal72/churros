'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'agents', null, (test) => {
  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 2 } }).get(test.api);
  });

  it(`should allow SR for ${test.api} and S for ${test.api}/{id}/incidents`, () => {
    let agentId;
    return cloud.get(test.api)
      .then(r => agentId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${agentId}`))
      .then(r => cloud.get(`${test.api}/${agentId}/incidents`));
  });
});
