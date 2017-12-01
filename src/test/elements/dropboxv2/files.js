'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const faker = require('faker');
const expect = require('chakram').expect;

suite.forElement('documents','files',(test) => {

  let jpgFile = __dirname + '/assets/brady.jpg';
  var jpgFileBody,revisionId;
  let directoryPath = faker.random.word();

  before(() => cloud.withOptions({ qs : { path : `/${directoryPath}/brady.jpg` }}).postFile(test.api, jpgFile)
  .then(r => jpgFileBody = r.body));

  after(() => cloud.delete(`${test.api}/${jpgFileBody.id}`));

  it('should allow GET /files/:id/revisions', () => {
      return cloud.get(`${test.api}/${jpgFileBody.id}/revisions`)
      .then(r => {
        expect(r.body.filter(obj => obj.fileName === 'brady.jpg')).to.not.be.empty;
        revisionId = r.body[0].id;
        })
      .then(() => cloud.get(`${test.api}/${jpgFileBody.id}/revisions/${revisionId}`))
      .then(r => expect(r.body.fileName).to.equal("brady.jpg"));
  });
});
