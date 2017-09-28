'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'pages', null, (test) => {
  it('should allow GET for /hubs/social/pages and /hubs/social/pages/{id}/page-access-token', () => {
    let pageId;
    return cloud.get(test.api)
      .then(r => pageId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${pageId}/page-access-token`));
  });
});
