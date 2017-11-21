'use strict';

const suite = require('core/suite');
const faker = require('faker');
const cloud = require('core/cloud');


suite.forElement('documents','files',(test) => {
  let dirFakeName = faker.random.word();
  let fileId,revisionId;
  let pngFile = __dirname+'/assets/imagepngformat.png';
  it('it should allow R for documents/files/:id/revisions',() => {
      return cloud.withOptions({ qs: { path: `/${dirFakeName}/jpgFile.jpg`, overwrite: 'true' } }).postFile(`hubs/documents/files`, pngFile)
      .then(r => fileId = r.body.id )
      .then(r => cloud.get(`${test.api}/${fileId}/revisions`))
      .then(r => revisionId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${fileId}/revisions/${revisionId}`));
    });
});
