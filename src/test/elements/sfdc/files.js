'use strict';
const tools = require('core/tools');
const cloud = require('core/cloud');
const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('crm', 'files', (test) => {

  let path = __dirname + '/assets/brady.jpg';
  let pathOnClient = `/brady-${tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 10)}.jpg`;
  let random = tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 10);
  let body = {Title: random};

  const fileWrap = (cb) => {
    let file;

    return cloud.withOptions({ qs: {pathOnClient: pathOnClient} }).postFile('/hubs/crm/files', path)
      .then(r => file = r.body)
      .then(r => cb(file))
      .then(r => cloud.delete(`/hubs/crm/files/${file.Id}`));
  };

  it('should allow CS /files & DELETE /files/:fileId', () => {
    const cb = (file) => {
      return cloud.withOptions({qs: { pageSize: 1 }}).get('/hubs/crm/files')
        .then(r => expect(r.body.length).to.equal(1))
        .then(r => cloud.withOptions({qs: { where: `Id='${file.Id}'`}}).get('/hubs/crm/files'))
        .then(r => expect(r.body.length).to.equal(1));
    };

    let file;
    return fileWrap(cb)
      .then(() => cloud.withOptions({ qs: {pathOnClient: pathOnClient} }).postFile('/hubs/crm/files', path))
      .then(r => file = r.body)
      .then(() => cloud.delete(`/hubs/crm/files/${file.Id}`));
  });

  it('should allow RU /files/:fileId/metadata', () => {
    let body = {Title: random};
    const cb = (file) => {
      return cloud.withOptions({body: body}).patch(`/hubs/crm/files/${file.Id}/metadata`)
        .then(r => file = r.body)
        .then(() => cloud.get(`/hubs/crm/files/${file.Id}/metadata`))
        .then(r => expect(r.body.Title).to.equal(random));
    };

    return fileWrap(cb);
  });

  it('should support CRUS /files/:fileId/versions', () => {
    let version;
    const cb = (file) => {
      return cloud.withOptions({qs: {pathOnClient: pathOnClient}}).postFile(`/hubs/crm/files/${file.Id}/versions`, path)
        .then(r => version = r.body)
        .then(() => cloud.get(`/hubs/crm/files/${file.Id}/versions`))
        .then(r => cloud.withOptions({body: body}).patch(`/hubs/crm/files/${file.Id}/versions/${version.Id}/metadata`))
        .then(() => cloud.get(`/hubs/crm/files/${file.Id}/versions/${version.Id}/metadata`))
        .then(r => expect(r.body.Title).to.equal(random));
    };

    return fileWrap(cb);
  });

  it('should support GET /files/:fileId/versions/latest-version', () => {
    const cb = (file) => {
      return cloud.get(`/hubs/crm/files/${file.Id}/versions/latest-version`);
    };

    return fileWrap(cb);
  });

  it('should support GET /files/:fileId/versions/latest-version/metadata', () => {
    let latestVersion;
    const cb = (file) => {
      return cloud.get(`/hubs/crm/files/${file.Id}/versions/latest-version/metadata`)
        .then(r => latestVersion = r.body)
        .then(r => expect(latestVersion.ContentDocumentId).to.equal(file.Id));
    };

    return fileWrap(cb);
  });

  it('should support CS /:objectName/:objectId/files & GET /:objectName/:objectId/files/details', () => {
    let sharedFile, objectId;
    let objectName = 'Account';
      return cloud.get(`/hubs/crm/${objectName}`)
        .then(r => objectId = r.body[0].Id)
        .then(() => cloud.withOptions({qs: {pathOnClient: pathOnClient}}).postFile(`/hubs/crm/${objectName}/${objectId}/files`, path))
        .then(r => sharedFile = r.body)
        .then(r => expect(sharedFile).to.contain.key('LinkedEntityId') && expect(sharedFile).to.contain.key('ContentDocumentId'))
        .then(() => cloud.get(`/hubs/crm/${objectName}/${objectId}/files`))
        .then(() => cloud.get(`/hubs/crm/${objectName}/${objectId}/files/details`))
        .then(r => expect(r.body[0]).to.contain.key('LatestPublishedVersionId'))
        .then(() => cloud.delete(`/hubs/crm/files/${sharedFile.ContentDocumentId}`));
  });

  it('should support CREATE /:objectName/:objectId/files/:fileId', () => {
    let sharedFile, objectId;
    let objectName = 'Account';
    const cb = (file) => {
      return cloud.get(`/hubs/crm/${objectName}`)
        .then(r => objectId = r.body[0].Id)
        .then(r => cloud.post(`/hubs/crm/${objectName}/${objectId}/files/${file.Id}`))
        .then(r => sharedFile = r.body)
        .then(r => expect(sharedFile).to.contain.key('LinkedEntityId') && expect(sharedFile).to.contain.key('ContentDocumentId'));
    };

    return fileWrap(cb);
  });

  it('should remove file if share with object fails on upload', () => {
    let objectId, numberOfFiles;
    let objectName = 'ContentDocument';
    //attach file to ContentDocument to ensure failure
    const cb = (file) => {
      return cloud.withOptions({qs: {pageSize:2000}}).get('/hubs/crm/files')
        .then(r => numberOfFiles = r.body.length)
        .then(r => cloud.withOptions({qs: {pageSize:2000}}).get(`/hubs/crm/${objectName}`))
        .then(r => objectId = r.body[0].Id)
        .then(() => cloud.withOptions({qs: {pathOnClient: pathOnClient}}).postFile(`/hubs/crm/${objectName}/${objectId}/files`, path, r =>
          expect(r).to.have.statusCode(400)))
        .then(() => cloud.withOptions({qs: {pageSize:2000}}).get(`/hubs/crm/${objectName}`))
        .then(r => expect(r.body.length).to.equal(numberOfFiles));
    };

    return fileWrap(cb);
  });

  it('should support description for /files', () => {
    let desc = "My file description";
    let file;
    return cloud.withOptions({ qs: {pathOnClient: pathOnClient, description: desc} }).postFile('/hubs/crm/files', path)
      .then(r => file = r.body)
      .then(r => expect(file.Description).to.equal(desc))
      .then(r => cloud.delete(`/hubs/crm/files/${file.Id}`));
  });

  it('should support description & reason for /files/:fileId/versions', () => {
    let desc = "My file description";
    let reason = "Needed a new version";
    let version;
    const cb = (file) => {
      return cloud.withOptions({qs: {pathOnClient: pathOnClient, description: desc, reason: reason}}).postFile(`/hubs/crm/files/${file.Id}/versions`, path)
        .then(r => version = r.body)
        .then(() => expect(version.Description).to.equal(desc))
        .then(r => expect(version.ReasonForChange).to.equal(reason));
    };

    return fileWrap(cb);
  });

});
