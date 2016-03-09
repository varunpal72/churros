'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('esignature', 'transientDocuments', null, (test) => {
  it('should allow CRUDS for /transientDocuments', () => {
    let attachmentId;
    return cloud.postFile(test.api, __dirname + '/assets/attach.txt')
      .then(r => attachmentId = r.body.id)  
	});
});