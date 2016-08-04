'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'tags', (test) => {
  it('should allow GET for /persons/:id', () => {
    let personId;
    return cloud.withOptions({qs: {pageSize: 1}}).get('/hubs/social/authors')
      .then(r => personId = r.body[0].id)
      .then(r => cloud.get(`/hubs/social/persons/${personId}`));
  });
});
