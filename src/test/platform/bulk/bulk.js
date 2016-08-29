'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const props = require('core/props');
const tools = require('core/tools');
const logger = require('winston');

//const payload = require('./assets/bulk');
//const schema = require('./assets/bulk.schema');

suite.forPlatform('bulk', (test) => {
  let instanceId;
  const element = props.getForKey('bulk', 'element');
  before(done => provisioner.create(element)
    .then(r => instanceId = r.body.id)
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
        expect(r.body.status).to.equal('COMPLETED')
      })))
      // get bulk query errors
      .then(r => cloud.get(`/hubs/crm/bulk/${bulkId}/errors`))
      // get bulk query results in JSON
      .then(r => cloud.get(`/hubs/crm/bulk/${bulkId}/accounts`, r => {
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
    //return cloud.postFile('/hubs/crm/bulk/accounts', __dirname + `/assets/${element}.accounts.csv`)
    // get bulk upload status

    // get bulk upload errors

    // get bulk upload results
  });

});