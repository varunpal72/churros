'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'pages', null, (test) => {
  it('should support GET /hubs/marketing/pages', () => {
    let pageId;
    return cloud.get(test.api)
      .then(r => pageId = r.body[0].entries[0].id)
      .then(r => cloud.get(`${test.api}/${pageId}`))
      .then(r => cloud.get(`${test.api}/${pageId}/reports`));
  });
});