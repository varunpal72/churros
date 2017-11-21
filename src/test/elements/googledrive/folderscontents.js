'use strict';

const suite = require('core/suite');
const faker = require('faker');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

let dirFakeName = faker.random.word();

suite.forElement('documents', 'files', (test) => {

  let pngFile = __dirname + '/assets/imagepngformat.png';
  let jpgFile = __dirname + '/assets/Penguins.jpg';
  let texFile = __dirname + '/assets/sampletext.txt';

  it('it should allow R for documents/folders/contents', () => {
    return cloud.withOptions({ qs: { path: `/${dirFakeName}/Penguins`, overwrite: 'true' } }).postFile(test.api, jpgFile)
      .then(cloud.withOptions({ qs: { path: `/${dirFakeName}/imagepngformat`, overwrite: 'true' } }).postFile(test.api, pngFile))
      .then(cloud.withOptions({ qs: { path: `/${dirFakeName}/sampletext`, overwrite: 'true' } }).postFile(test.api, texFile));
  });
});

suite.forElement('documents', 'folders/contents', (test) => {

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

  it('it should allow Get option with mimeType', () => {
    return cloud.withOptions({ qs: { path: `/${dirFakeName}`, where: "mimeType='text/plain' OR title='sampletext'" } }).get(test.api)
      .then(r => expect(r.body[0].name === 'sampletext').to.not.be.empty);
  });

});
