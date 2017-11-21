'use strict';

const suite = require('core/suite');
const faker = require('faker');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const conditionsPayload ={
        condition1: "title='sampletext'",
        condition2: "extension='.jpg'",
        condition3: "directory='true'",
        condition4: "mimeType='image/png'",
        condition5: "mimeType='image/png,image/jpeg'",
        condition6: "title='sampletext,imagepngformat'",
        condition7: "title='sampletext' OR extension='.jpg'",
        condition8: "extension='.jpg' OR directory='true'",
        condition9: "mimeType='image/jpeg' OR directory='true' OR extension='.jpg' OR title='sampletext'",
        condition10: "mimeType='image/jpeg,text/plain' OR directory='true' OR extension='.jpg' OR title='sampletext,files'"

 };

suite.forElement('documents','folders/contents',(test) => {

  let dirFakeName = faker.random.word();
  let pngFile = __dirname+'/assets/imagepngformat.png';
  let jpgFile = __dirname + '/assets/Penguins.jpg';
  let texFile = __dirname+'/assets/sampletext.txt';

    it('it should allow R for documents/folders/contents',() => {
      return cloud.withOptions({ qs: { path: `/${dirFakeName}/Penguins`, overwrite: 'true' } }).postFile(`hubs/documents/files`, jpgFile)
      .then(cloud.withOptions({ qs: { path: `/${dirFakeName}/imagepngformat`, overwrite: 'true' } }).postFile(`hubs/documents/files`, pngFile))
      .then(cloud.withOptions({ qs: { path: `/${dirFakeName}/sampletext`, overwrite: 'true' } }).postFile(`hubs/documents/files`, texFile))
    });

    it('it should allow Get option with title', () => {
      return cloud.withOptions({ qs: { path: `/${dirFakeName}`, where: "title='sampletext'" } }).get(test.api)
      .then(r => expect(r.body[0].name === 'sampletext').to.not.be.empty);
    });

    it('it should allow Get option with extension', () => {
      return cloud.withOptions({ qs: { path: `/${dirFakeName}`, where: "extension='.jpg'" } }).get(test.api)
      .then(r => expect(r.body[0].name === 'Penguins').to.not.be.empty);
    });

    it('it should allow Get option with mimeType', () => {
      return cloud.withOptions({ qs: { path: `/${dirFakeName}`, where: "mimeType='image/png'" } }).get(test.api)
      .then(r => expect(r.body[0].name === 'imagepngformat').to.not.be.empty);
    });

  });
