'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('helpdesk', 'bulk', null, (test) => {

    it('should support bulk download', () => {
        let bulkId;
        const opts = { qs: { q: 'select * from contacts where firstName=\'Rick\'' } };

        // start bulk download
        return cloud.withOptions(opts).post('/hubs/helpdesk/bulk/query')
            .then(r => {
                expect(r.body.status).to.equal('CREATED');
                bulkId = r.body.id;
            })
            // get bulk download status
            .then(r => tools.wait.upTo(30000).for(() => cloud.get(`/hubs/helpdesk/bulk/${bulkId}/status`, r => {
                expect(r.body.status).to.equal('COMPLETED');
                expect(r.body.recordsCount > 0).to.be.true;
                expect(r.body.recordsFailedCount).to.equal(0);
            })))
            .then(r => cloud.withOptions({ headers: { accept: "application/json" }, qs: { json: '{ "convertToNativeType": "false" }' }}).get(`/hubs/helpdesk/bulk/${bulkId}/contacts`, r => {
                r.body.forEach(contact => expect(contact).to.have.property('firstName','Rick'));
            }))
            .then(r => cloud.withOptions({ headers: { accept: "text/csv" } }).get(`/hubs/helpdesk/bulk/${bulkId}/contacts`, r => {
                expect(r.body).to.contain('Rick');
            }))
            // get bulk download errors
            .then(r => cloud.get(`/hubs/helpdesk/bulk/${bulkId}/errors`));
    });

});
