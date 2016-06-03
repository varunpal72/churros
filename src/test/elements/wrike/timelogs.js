'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/timelogs');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'timelogs', { payload: payload }, (test) => {

  var accountID;
  var folderID;
  var rootFolderID;
  var taskID;
  var timelogID;

  before(function() {
      return cloud.get('/hubs/helpdesk/accounts')
      .then(r => {accountID = r.body[0].id;})
      .then(() => cloud.get('/hubs/helpdesk/folders'))
      .then(r => {for (var i=0;i<r.body.length;i++){if (r.body[i].title === "Root") {rootFolderID = r.body[i].id;}}})
      .then(() => {
        let temp = {"title": "Test Folder"};
        return cloud.post('/hubs/helpdesk/folders/' + rootFolderID + '/folders', temp);
      })
      .then(r => folderID = r.body.id)
      .then(() => {
        let temp = {"title": "Test Task"};
        return cloud.post('/hubs/helpdesk/folders/' + folderID + '/tasks', temp);
      })
      .then(r => {taskID = r.body.id; return r;});
  });

  it('should POST a timelog', () => {
    let temp = {"hours": "0.5", "trackedDate": "2016-05-18"};
    return cloud.post('/hubs/helpdesk/tasks/' + taskID + '/timelogs', temp)
    .then(r => {timelogID = r.body.id; return r;})
    .then(r => expect(r.body.hours).to.eq(0.5));
  });

  it('should PUT a timelog', () => {
    let temp = {"hours": "0.7"};
    return cloud.put('/hubs/helpdesk/timelogs/' + timelogID, temp)
    .then(r => expect(r.body.hours).to.eq(0.7));
  });

  it('should allow GET all from an account', () => {
    var isGreaterThan = false;
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/timelogs')
    .then(r => {if (r.body.length > 0) {isGreaterThan = true;}})
    .then(r => expect(isGreaterThan).is.eq(true));
  });

  it('should allow GET all from a task', () => {
    var isGreaterThan = false;
    return cloud.get('/hubs/helpdesk/tasks/' + taskID + '/timelogs')
    .then(r => {if (r.body.length > 0) {isGreaterThan = true;}})
    .then(r => expect(isGreaterThan).is.eq(true));
  });

  it('should allow GET timelog by id', () => {
    return cloud.get('/hubs/helpdesk/timelogs/' + timelogID)
    .then(r => expect(r).to.have.statusCode(200));
  });

  //CLEANUP TASK
  it('should delete the test timelogs', () => {
    return cloud.delete('/hubs/helpdesk/timelogs/' + timelogID)
    .then(r => expect(r).to.have.statusCode(200));
  });

  //CLEANUP FOLDER
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
