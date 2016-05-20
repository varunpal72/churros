'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/folders');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'folders', { payload: payload }, (test) => {

  var accountID;
  var folderID;
  var rootFolderID;

  it('should GET the associated account', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;});
  });

  it('should GET all folders', () => {
    return cloud.get('/hubs/helpdesk/folders')
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should GET the root folder', () => {
    return cloud.get('/hubs/helpdesk/folders')
    .then(r => {for (var i=0;i<r.body.length;i++){if (r.body[i].title === "Root") {rootFolderID = r.body[i].id}}});
  });

  it('should POST the test folder', () => {
    let temp = {"title": "Test Folder"};
    return cloud.post('/hubs/helpdesk/folders/' + rootFolderID + '/folders', temp)
    .then(r => folderID = r.body.id);
  });

  it('should GET folder by ID', () => {
    return cloud.get('/hubs/helpdesk/folders/' + folderID)
    .then(r => expect(r.body.id).to.eq(folderID));
  });

  it('should PUT folder by ID', () => {
    let temp = {"title": "update folder title"};
    return cloud.put('/hubs/helpdesk/folders/' + folderID, temp)
    .then(r => expect(r.body.title).to.eq("update folder title"));
  });

  //CLEANUP FOLDER
  it('should delete the test folder', () => {
    return cloud.delete('/hubs/helpdesk/folders/' + folderID)
    .then(r => expect(r).to.have.statusCode(200));
  });
});
