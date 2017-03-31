'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/files');
const expect = require('chakram').expect;
payload.path = `/${tools.random()}`;

const updatePayload ={
        name: tools.random(),
        path:`/${tools.random()}`
 };
const propertiesPayload={
      "properties": {
            "customKey": tools.random()
  }
};

suite.forElement('documents', 'files',{ payload: payload }, (test) => {
    it('should allow ping for googledrive' , () => {
    return cloud.get(`/hubs/documents/ping`);
    });

    it('should allow CRD for hubs/documents/files and RU for hubs/documents/files/metadata by path', () => {
    let UploadFile = __dirname + '/assets/Penguins.jpg',srcPath,destPath;
    return cloud.withOptions({ qs: { path:`/${tools.random()}`, overwrite:'true' } }).postFile(`${test.api}`, UploadFile)
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).post(`${test.api}/copy`, payload))
      .then(r => destPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).get(`${test.api}/links`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).get(`${test.api}/metadata`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).patch(`${test.api}/metadata`, updatePayload))
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).patch(`${test.api}/metadata/properties`, propertiesPayload))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).delete(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { path:`${destPath}` } }).delete(`${test.api}`));
    });

    it('should allow CRD for hubs/documents/files and RU for hubs/documents/files/metadata by id', () => {
    let UploadFile = __dirname + '/assets/Penguins.jpg',fileId,destPath;
    return cloud.withOptions({ qs: { path:`/${tools.random()}`, overwrite:'true' } }).postFile(`${test.api}`, UploadFile)
      .then(r => fileId = r.body.id)
      .then(r => cloud.get(`${test.api}/${fileId}`))
      .then(r => cloud.post(`${test.api}/${fileId}/copy`, payload))
      .then(r => destPath = r.body.path)
      .then(r => cloud.get(`${test.api}/${fileId}/links`))
      .then(r => cloud.get(`${test.api}/${fileId}/metadata`))
      .then(r => cloud.patch(`${test.api}/${fileId}/metadata`, updatePayload))
      .then(r => fileId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${fileId}/metadata/properties`, propertiesPayload))
      .then(r => cloud.delete(`${test.api}/${fileId}`))
      .then(r => cloud.withOptions({ qs: { path:`${destPath}` } }).delete(`${test.api}`));
    });
    // Test For Export Functionality
    it('Export Doc', () => {
      let DocFile = '/ChurrosDocDoNotDelete';
      return cloud.withOptions({ qs: { path: DocFile, mediaType:'text/plain'} }).get(test.api)
        .then(r => {
          expect(r.body).to.not.be.null;
          expect(r.body).to.contain('Sample Word Doc');
        });
    });
    it('Export SS', () => {
      let SSFile = '/ChurrosSSDoNotDelete';
      return cloud.withOptions({ qs: { path: SSFile, mediaType:'text/csv'} }).get(test.api)
        .then(r => {
          expect(r.body).to.not.be.null;
//          console.log(r);
          expect(r.body).to.contain('Test1,Test2,Tes3,Test4');
        });
    });
    it('Export PPT', () => {
      let PPTFile = '/ChurrosPPTDoNotDelete';
      return cloud.withOptions({ qs: { path: PPTFile, mediaType:'text/plain'} }).get(test.api)
        .then(r => {
          expect(r.body).to.not.be.null;
//          console.log(r);
          expect(r.body).to.contain('Churros PPT Test');
        });
    });
    it('Export PNG', () => {
      let PNGFile = '/ChurrosPNGDoNotDelete';
      return cloud.withOptions({ qs: { path: PNGFile, mediaType:'application/pdf'} }).get(test.api)
        .then(r => {
          expect(r.body).to.not.be.null;
//          console.log(r);
          expect(r.body).to.contain('%PDF-1.4');
        });
    });
});
