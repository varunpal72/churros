'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('helpdesk', 'folders', (test) => {
  test.should.return200OnGet();

  it('should CRUD for folders', () => {
    let rootFolderId, folderId;
    let temp = { "title": "update folder title" };

    return cloud.get('/hubs/helpdesk/folders')
      .then(r => rootFolderId = r.body.filter(i => i.title === 'Root')[0].id)
      .then(r => cloud.post('/hubs/helpdesk/folders/' + rootFolderId + '/folders', { "title": "Test Folder" }))
      .then(r => folderId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/folders/${folderId}`))
      .then(r => cloud.put(`/hubs/helpdesk/folders/${folderId}`, temp))
      .then(r => expect(r.body.title).to.eq(temp.title))
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${folderId}`));
  });
});
