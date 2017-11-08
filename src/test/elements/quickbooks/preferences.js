'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'preferences', (test) => {

  test.should.supportPagination();
  it('should allow Patch for preferences', () => {
    return cloud.get(test.api)
      .then(r => cloud.patch(`${test.api}/${r.body[0].Id}`, { "SyncToken": r.body[0].SyncToken, "sparse":false })); 
  });
});

