'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/comments');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'comments', { payload: payload }, (test) => {

  var accountID;
  var folderID;
  var rootFolderID;
  var taskID;
  var commentID;
  var taskCommentID;

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
    .then(r => taskID = r.body.id);
  });

  it('should POST a new comment in folder', () => {
    let temp = {"text": "Test Comment"};
    return cloud.post('/hubs/helpdesk/folders/' + folderID + '/comments', temp)
    .then(r => commentID = r.body.id);
  });

  it('should GET folder comment by ID', () => {
    return cloud.get('/hubs/helpdesk/comments/' + commentID)
    .then(r => expect(r.body.id).to.eq(commentID));
  });

  it('should POST a new comment in task', () => {
    let temp = {"text": "Test Comment"};
    return cloud.post('/hubs/helpdesk/tasks/' + taskID + '/comments', temp)
    .then(r => taskCommentID = r.body.id);
  });

  it('should GET task comment by ID', () => {
    return cloud.get('/hubs/helpdesk/comments/' + taskCommentID)
    .then(r => expect(r.body.id).to.eq(taskCommentID));
  });

  it('should allow GET all from account', () => {
    var isGreaterThan = false;
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/comments')
    .then(r => {if (r.body.length > 0) {isGreaterThan = true;}})
    .then(r => expect(isGreaterThan).is.eq(true));
  });

  //CLEANUP COMMENT
  it('should delete the test comment', () => {
    return cloud.delete('/hubs/helpdesk/comments/' + commentID)
    .then(r => expect(r).to.have.statusCode(200));
  });

  //CLEANUP COMMENT
  it('should delete the test comment', () => {
    return cloud.delete('/hubs/helpdesk/comments/' + taskCommentID)
    .then(r => expect(r).to.have.statusCode(200));
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
