'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/tasks');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'tasks', { payload: payload }, (test) => {

  var accountID;
  var folderID;
  var rootFolderID;
  var taskID;

  it('should GET the associated account', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;});
  });

  it('should GET the root folder', () => {
    return cloud.get('/hubs/helpdesk/folders')
    .then(r => {for (var i=0;i<r.body.length;i++){if (r.body[i].title === "Root") {rootFolderID = r.body[i].id;}}});
  });

  it('should POST the test folder', () => {
    let temp = {"title": "Test Folder"};
    return cloud.post('/hubs/helpdesk/folders/' + rootFolderID + '/folders', temp)
    .then(r => folderID = r.body.id);
  });

  it('should POST a new task', () => {
    let temp = {"title": "Test Task"};
    return cloud.post('/hubs/helpdesk/folders/' + folderID + '/tasks', temp)
    .then(r => {taskID = r.body.id; return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should GET a task by id', () => {
    return cloud.get('/hubs/helpdesk/tasks/' + taskID)
    .then(r => expect(r.body.id).to.eq(taskID));
  });

  it('should PUT a task', () => {
    let temp = {"title": "Update Task"};
    return cloud.put('/hubs/helpdesk/tasks/' + taskID, temp)
    .then(r => expect(r.body.title).to.eq("Update Task"));
  });

  it('should allow GET all from account', () => {
    var isGreaterThan = false;
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/tasks')
    .then(r => {if (r.body.length > 0) {isGreaterThan = true;}})
    .then(r => expect(isGreaterThan).is.eq(true));
  });

  it('should allow GET all from folder', () => {
    var isGreaterThan = false;
    return cloud.get('/hubs/helpdesk/folders/' + folderID + '/tasks')
    .then(r => {if (r.body.length > 0) {isGreaterThan = true;}})
    .then(r => expect(isGreaterThan).is.eq(true));
  });

  //CLEANUP TASK
  it('should delete the test task', () => {
    return cloud.delete('/hubs/helpdesk/tasks/' + taskID)
    .then(r => expect(r).to.have.statusCode(200));
  });

  //CLEANUP FOLDER
  it('should delete the test folder', () => {
    return cloud.delete('/hubs/helpdesk/folders/' + folderID)
    .then(r => expect(r).to.have.statusCode(200));
  });
});
