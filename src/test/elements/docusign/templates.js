'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('esignature', 'templates', null, (test) => {
  it('should get all templates and then just the first one', () => {
    let templateId;

    return cloud.get(test.api)
      .then(r => templateId = r.body[0].templateId)
      .then(r => cloud.get(`${test.api}/${templateId}`));
  });
});
