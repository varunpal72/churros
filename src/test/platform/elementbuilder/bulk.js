'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const fs = require('fs');
const provisioner = require('core/provisioner');
const bulkElementJson = require('./assets/bulk/bulk_element.json');

suite.forPlatform('element-bulk', {}, (test) => {
  let bulkElement;
  let bulkInstance;
  before(() => cloud.post('elements', bulkElementJson)
    .then(r => bulkElement = r.body)
    .then(r => provisioner.create('elementbulk', undefined, 'elements/elementbulk/instances'))
    .then(r => bulkInstance = r.body));

  it('should support bulk download', () => {
    let bulkId;
    const opts = {
      qs: {
        q: 'select * from contacts',
        from: '2017-05-24T18:31:01.000Z'
      }
    };

    // start bulk download
    return cloud.withOptions(opts).post('/hubs/general/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk download status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/general/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
        expect(r.body.recordsCount > 0).to.be.true;
        expect(r.body.recordsFailedCount).to.equal(0);
      })))
      .then(r => cloud.withOptions({ headers: { accept: "application/json" } }).get(`/hubs/general/bulk/${bulkId}/contacts`, r => {
        expect(r.body).to.have.property('createdDate', '2017-05-24T18:31:01Z');
      }));
  });

  it('should fail when bulk download is disabled', () => {
    const opts = {
      qs: {
        q: 'select * from accounts',
        from: '2017-05-24T18:31:01.000Z'
      }
    };

    return cloud.withOptions(opts).post(`/hubs/general/bulk/query`, null, (r) => expect(r).to.have.statusCode(400));
  });

  it('should fail when bulk upload is disabled', () => {
    let filePath = __dirname + '/assets/bulk/accounts.csv';
    let options = {};
    options.formData = {};
    options.formData.file = fs.createReadStream(filePath);
    return cloud.post('/hubs/general/bulk/accounts',  null, (r) => expect(r).to.have.statusCode(400), options);
  });

  after(() => {
    return provisioner.delete(bulkInstance.id, 'elements/elementbulk/instances')
      .then(r => cloud.delete(`elements/${bulkElement.id}`));
  });
});
