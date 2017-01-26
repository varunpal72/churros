'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'pages', null, (test) => {
  test.should.supportSr();
  it('should allow R for /hubs/marketing/leads', () => {
    let pageId;
    return cloud.get(test.api)
      .then(r => pageId = r.body[0].id)
      .then(r => cloud.get(`/hubs/marketing/leads/${pageId}`));
  });
});