'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('helpdesk', 'folders', (test) => {
  test.should.return200OnGet();

  it('should CRUD and copy for folders', () => {
    let rootFolderId, folderId, copyFolderId;
    let temp = { "title": "update folder title", "project": {"status": "Red"}, "metadata": [{"key": "myMeta", "value": "meta data!"}]};

    return cloud.get('/hubs/helpdesk/folders')
      .then(r => rootFolderId = r.body.filter(i => i.title === 'Root')[0].id)
      .then(r => cloud.post(`/hubs/helpdesk/folders/${rootFolderId}/folders`, { "title": "Test Folder" }))
      .then(r => folderId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/folders/${folderId}`))
      .then(r => cloud.put(`/hubs/helpdesk/folders/${folderId}`, temp))
      .then(r => expect(r.body.title).to.eq(temp.title))
      .then(r => cloud.post(`/hubs/helpdesk/folders/${folderId}/copy`, { "title": "Copy Folder", "parent":  folderId}))
      .then(r => copyFolderId = r.body.id)
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${copyFolderId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${folderId}`));
  });
});
