'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('general', 'bulk', null, (test) => {

  it('should support bulk download of activities', () => {
    let bulkId;
    var priorDate = new Date().setDate(new Date().getDate()-30);
    const opts = { qs: { q: 'select * from activities', from : new Date(priorDate).toISOString() } };

    // start bulk download
    return cloud.withOptions(opts).post('/hubs/general/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk download status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/general/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
        expect(r.body.recordsFailedCount).to.equal(0);
      })))
      // get bulk download errors
      .then(r => cloud.get(`/hubs/general/bulk/${bulkId}/errors`));
  });

  it('should support bulk download of users', () => {
    let bulkId;
    var priorDate = new Date().setDate(new Date().getDate()-30);
    const opts = { qs: { q: 'select * from users where query = \'(properties["$created"]  > "2011-03-14T09:53:54")\''} };

    // start bulk download
    return cloud.withOptions(opts).post('/hubs/general/bulk/query')
      .then(r => {
        expect(r.body.status).to.equal('CREATED');
        bulkId = r.body.id;
      })
      // get bulk download status
      .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/general/bulk/${bulkId}/status`, r => {
        expect(r.body.status).to.equal('COMPLETED');
        expect(r.body.recordsFailedCount).to.equal(0);
      })))
      // get bulk download errors
      .then(r => cloud.get(`/hubs/general/bulk/${bulkId}/errors`));
  });

});
