'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('marketing', 'bulk', (test) => {
  it('should support bulk download with a where clause', () => {
    let bulkId;
    // start bulk query
    return cloud.withOptions({ qs: { q: 'select * from contacts where firstname = \'Kimberly\'' } }).post('/hubs/marketing/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
        tools.sleep(3);
      })
      // wait for download to finish by checking status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/marketing/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
      })))
      // get bulk query errors
      .then(r => cloud.get(`/hubs/marketing/bulk/${bulkId}/errors`))
      // get bulk query results in JSON
      .then(r => cloud.withOptions({ headers: { accept: "application/json" }, qs: {json: '{ "convertToNativeType": "false" }' }}).get(`/hubs/marketing/bulk/${bulkId}/contacts`, r => {
        expect(r.body).to.not.be.empty;
      }))
      // get bulk query results in CSV
      .then(r => cloud.withOptions({ headers: { accept: "text/csv" } }).get(`/hubs/marketing/bulk/${bulkId}/contacts`, r => {
        expect(r.body).to.not.be.empty;
      }));
  });

});
