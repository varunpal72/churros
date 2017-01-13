'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'pages', null, (test) => {
  it('should allow READ and SEARCH for /hubs/marketing/pages', () => {
    let pageId;
    return cloud.get(test.api)
      .then(r => pageId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${pageId}`))
      .then(r => cloud.get(`/hubs/marketing/leads/${pageId}`));
  });
});
