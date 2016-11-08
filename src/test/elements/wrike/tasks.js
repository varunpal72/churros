'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'tasks', (test) => {
  it('should all CRUDs for account tasks', () => {
    let temp = { "title": "Test Task" };
    let folderId, taskId;
    return cloud.get('/hubs/helpdesk/folders')
      .then(r => {
        const rootFolderId = r.body.filter(i => i.title === 'Root')[0].id;
        return cloud.post(`/hubs/helpdesk/folders/${rootFolderId}/folders`, { "title": "Test Folder" });
      })
      .then(r => folderId = r.body.id)
      .then(r => cloud.post(`/hubs/helpdesk/folders/${folderId}/tasks`, temp))
      .then(r => taskId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/tasks/${taskId}`))
      .then(r => cloud.get(`/hubs/helpdesk/folders/${folderId}/tasks`))
      .then(r => cloud.put(`/hubs/helpdesk/tasks/${taskId}`, { "title": "Update Task" }))
      .then(r => cloud.delete(`/hubs/helpdesk/tasks/${taskId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${folderId}`));
  });

  it('should allow GET all tasks from an account', () => {
    return cloud.get('/hubs/helpdesk/accounts')
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${r.body[0].id}/tasks`));
  });
});
