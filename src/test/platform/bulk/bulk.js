'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const props = require('core/props');
const tools = require('core/tools');

let workflow = require('./assets/hubspotcrm.workflow.json');

suite.forPlatform('bulk', (test) => {
  let instanceId;
  const element = props.getForKey('bulk', 'element');
  before(done => provisioner.create(element)
    .then(r => {
      instanceId = r.body.id;
      workflow[ 0 ].targetConfiguration.token = r.body.token;
    })
    .then(r => done()));

  after(done => provisioner.delete(instanceId)
    .then(r => done()));

  it('should support bulk download', () => {
    let bulkId;
    // start bulk query
    return cloud.withOptions({ qs: { q: 'select * from accounts' } }).post('/hubs/crm/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // wait for download to finish by checking status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/crm/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
      })))
      // get bulk query errors
      .then(r => cloud.get(`/hubs/crm/bulk/${bulkId}/errors`))
      // get bulk query results in JSON
      .then(r => cloud.withOptions({ headers: { accept: "application/json" }, qs: {json: '{ "convertToNativeType": "false" }' }}).get(`/hubs/crm/bulk/${bulkId}/accounts`, r => {
        expect(r.body).to.not.be.empty;
      }))
      // get bulk query results in CSV
      .then(r => cloud.withOptions({ headers: { accept: "text/csv" } }).get(`/hubs/crm/bulk/${bulkId}/accounts`, r => {
        expect(r.body).to.not.be.empty;
      }));
  });

  it('should support bulk upload', () => {
    let bulkId;
    // start bulk upload
    return cloud.postFile('/hubs/crm/bulk/accounts', __dirname + `/assets/${element}.accounts.csv`)
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk upload status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/crm/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
      })))
      // get bulk upload errors
      .then(r => cloud.get(`/hubs/crm/bulk/${bulkId}/errors`));
  });

  it('should support bulk workflow', () => {
    let bulkId;
    // start bulk workflow
    return cloud.post('/hubs/crm/bulk/workflows', workflow)
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk upload status
      .then(r => tools.wait.upTo(120000).for(() => cloud.withOptions({ qs: { pageSize: 1 } }).get('/bulkloader', r => {
        expect(r.body[ 0 ].groupName).to.equal(bulkId);
        expect(r.body[ 0 ].status).to.equal('COMPLETED');
      })));
  });

  it('should support scheduled bulk workflow', () => {
    let jobId;
    // start bulk workflow
    return cloud.withOptions({ headers: { "Elements-Schedule-Request": "0 * * * * ?" } }).post('/hubs/crm/bulk/workflows', workflow)
      .then(r => {
        expect(r.body.id).to.not.be.empty;
        jobId = r.body.id;
      })
      // get bulk upload status
      .then(r => tools.wait.upTo(200000).for(() => cloud.withOptions({ qs: { jobId: jobId } }).get('/bulkloader', r => {
        expect(r.body[ 0 ].status).to.equal('COMPLETED');
      })));
  });

});
