'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'mailThreads', { skip: false }, (test) => {
  it('should support RUD for mailThread', () => {
    let id;
    return cloud.withOptions({ qs: { folder: "inbox" } }).get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        id = r.body[0].id;
        return cloud.get(`${test.api}/${id}`)
          .then(r => cloud.delete(`$test.api}/${id}`));
      });
  });

});
