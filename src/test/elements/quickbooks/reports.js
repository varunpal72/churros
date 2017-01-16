'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'reports', null, (test) => {

  it('should support metadata GET and get report by id operation for reports', () => {
    let reportId;
    return cloud.get(test.api + '/metadata')
      .then(r => reportId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${reportId}`));
  });
});
