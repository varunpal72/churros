'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('crm', 'bulk', null, (test) => {

    it('should support bulk download', () => {
        let bulkId;
        const opts = { qs: { q: 'select * from contacts where firstName=\'Rick\'' } };

        // start bulk download
        return cloud.withOptions(opts).post('/hubs/crm/bulk/query')
            .then(r => {
                expect(r.body.status).to.equal('CREATED');
                bulkId = r.body.id;
            })
            // get bulk download status
            .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/crm/bulk/${bulkId}/status`, r => {
                expect(r.body.status).to.equal('COMPLETED');
                expect(r.body.recordsCount > 0).to.be.true;
                expect(r.body.recordsFailedCount).to.equal(0);
            })))
            .then(r => cloud.withOptions({ headers: { accept: "application/json" }}).get(`/hubs/crm/bulk/${bulkId}/contacts`, r => {
                r.body.every(contact => expect(contact).to.have.property('firstName','Rick'));
            }))
            .then(r => cloud.withOptions({ headers: { accept: "text/csv" } }).get(`/hubs/crm/bulk/${bulkId}/contacts`, r => {
                expect(r.body).to.contain('Rick');
            }))
            // get bulk download errors
            .then(r => cloud.get(`/hubs/crm/bulk/${bulkId}/errors`));
    });

});
