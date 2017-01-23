'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'folders', null, (test) => {
  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 2 } }).get(test.api);
  });

  it(`should allow S for ${test.api} and ${test.api}/{id}/incidents`, () => {
    let folderId;

    return cloud.get(test.api)
      .then(r => folderId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${folderId}/incidents`));
  });
});
