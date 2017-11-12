'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const expect = require('chakram').expect;
const faker = require('faker');


suite.forElement('finance', 'vendors', (test) => {
    afterEach(done => {
        // to avoid rate limit errors
        setTimeout(done, 2500);
    });
    
    test.should.supportPagination();
    
    it('should support CRUDS for /vendors', () => {
        let vendor = require('./assets/vendor.json');
        let invoice = require('./assets/vendor-invoice.json');
        let vendorId;
        let vendorUpdate = vendor;

        vendor.Name = faker.name.findName();
        vendorUpdate.FirstName = faker.name.firstName();

        return cloud.post(test.api, vendor)
        .then(r => vendorId = r.body.ContactID)
        .then(r => cloud.get(`${test.api}/${vendorId}`))
        .then(r => expect(r.body.IsSupplier).to.be.false)
        .then(() => invoice.Contact.ContactID = vendorId)
        .then(() => cloud.post('/invoices', invoice))
        .then(() => cloud.patch(`${test.api}/${vendorId}`, vendorUpdate))
        .then(() => cloud.get(`${test.api}/${vendorId}`))
        .then(r => {
            expect(r.body.FirstName).to.equal(vendorUpdate.FirstName);
            expect(r.body.IsSupplier).to.be.true;
        })
        .then(() => cloud.withOptions({qs:{where: `ContactID='${vendorId}'`}}).get(test.api))
        .then(r => expect(r.body.length).to.equal(1))
        .then(() => cloud.delete(`${test.api}/${vendorId}`));
    });
});