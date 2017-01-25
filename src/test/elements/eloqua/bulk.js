'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('marketing', 'bulk', null, (test) => {

  it('should support bulk download of a custom object', () => {
    let bulkId;
    const opts = { qs: { q: 'select * from customTest' } };

    // start bulk upload
    return cloud.withOptions(opts).post('/hubs/marketing/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk upload status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/marketing/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
        expect(r.body.recordsCount > 0).to.be.true;
        expect(r.body.recordsFailedCount).to.equal(0);
      })))
      // .then(r => cloud.get(`/hubs/marketing/bulk/${bulkId}/customTest`, r => {
      //
      // })
      // get bulk upload errors
      .then(r => cloud.get(`/hubs/marketing/bulk/${bulkId}/errors`));
  });

  it('should support bulk upload of a custom object', () => {
    let bulkId;
    const metaData = {identifierFieldName: 'custom.111'};
    const opts = { formData: { metaData: JSON.stringify(metaData) } };

    // start bulk upload
    return cloud.withOptions(opts).postFile('/hubs/marketing/bulk/customTest', `${__dirname}/assets/customTest.csv`)
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk upload status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/marketing/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
        expect(r.body.recordsCount).to.equal(2);
        expect(r.body.recordsFailedCount).to.equal(0);
      })))
      // get bulk upload errors
      .then(r => cloud.get(`/hubs/marketing/bulk/${bulkId}/errors`));
  });

});
