'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'comments', (test) => {
  let folderId, rootFolderId, taskId;
  before(() => {
    return cloud.get('/hubs/helpdesk/folders')
      .then(r => rootFolderId = r.body.filter(i => i.title === 'Root')[0].id)
      .then(() => cloud.post(`/hubs/helpdesk/folders/${rootFolderId}/folders`, { "title": "Test Folder" }))
      .then(r => folderId = r.body.id)
      .then(() => cloud.post(`/hubs/helpdesk/folders/${folderId}/tasks`, { "title": "Test Task" }))
      .then(r => taskId = r.body.id);
  });

  /* Cleanup */
  after(() => {
    return cloud.delete(`/hubs/helpdesk/tasks/${taskId}`)
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${folderId}`));
  });

  it('should allow retrieving an account\'s comments', () => {
    let accountId;
    return cloud.get('/hubs/helpdesk/accounts')
      .then(r => accountId = r.body[0].id)
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${accountId}/comments`));
  });

  it('should allow CRD for folder comments', () => {
    let commentId;
    return cloud.post(`/hubs/helpdesk/folders/${folderId}/comments`, { "text": "Test Comment" })
      .then(r => commentId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/comments/${commentId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/comments/${commentId}`));
  });


  it('should CRD for task comments', () => {
    let taskCommentId;
    return cloud.post(`/hubs/helpdesk/tasks/${taskId}/comments`, { "text": "Test Comment" })
      .then(r => taskCommentId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/comments/${taskCommentId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/comments/${taskCommentId}`));
  });
});
