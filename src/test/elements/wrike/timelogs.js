'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'timelogs', (test) => {
  it('should allow CRUD for timelogs', () => {
    let accountId, folderId, taskId, timelogId;
    return cloud.get('/hubs/helpdesk/accounts')
      .then(r => accountId = r.body[0].id)
      .then(() => cloud.get('/hubs/helpdesk/folders'))
      .then(r => {
        const rootFolderId = r.body.filter(i => i.title === 'Root')[0].id;
        return cloud.post(`/hubs/helpdesk/folders/${rootFolderId}/folders`, { "title": "Test Folder" });
      })
      .then(r => folderId = r.body.id)
      .then(() => cloud.post(`/hubs/helpdesk/folders/${folderId}/tasks`, { "title": "Test Task" }))
      .then(r => taskId = r.body.id)
      .then(r => cloud.post(`/hubs/helpdesk/tasks/${taskId}/timelogs`, { "hours": "0.5", "trackedDate": "2016-05-18" }))
      .then(r => timelogId = r.body.id)
      .then(r => cloud.put(`/hubs/helpdesk/timelogs/${timelogId}`, { "hours": "0.7" }))
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${accountId}/timelogs`))
      .then(r => cloud.get(`/hubs/helpdesk/tasks/${taskId}/timelogs`))
      .then(r => cloud.get(`/hubs/helpdesk/timelogs/${timelogId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/timelogs/${timelogId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/tasks/${taskId}`))
      .then(r => cloud.delete(`/hubs/helpdesk/folders/${folderId}`));
  });
});
