'use strict';

const cloud = require('core/cloud.js');
const expect = require('chakram').expect;
const suite = require('core/suite');
const faker = require('faker');

suite.forElement('finance', 'reports', (test) => {
    /**
       GET /reports/metadata passes back a hard-coded payload so 
    */
    let reportsMetadataResponse = require('./assets/reports-metadataResponse.json');    
    expect(reportsMetadataResponse).to.not.be.empty;
    let reports = reportsMetadataResponse.filter(report => report.required.length === 0);
    expect(reports).to.not.be.empty;
    let contactReports = reportsMetadataResponse.filter(report => report.required[0] === 'contactId');
    expect(contactReports).to.not.be.empty;
    let bankAccountReports = reportsMetadataResponse.filter(report => report.required[0] === 'bankAccountId');
    expect(bankAccountReports).to.not.be.empty;
    expect(reportsMetadataResponse.length).to.equal(reports.length + contactReports.length + bankAccountReports.length);
    
    const contactWrap = (contactReportCallback) => {
        let contactId;
        let vendorPayload = require('./assets/contact.json');    
        vendorPayload.Name = faker.name.findName(); 
        return cloud.post('/vendors', vendorPayload)
            .then(r => contactId = r.body.ContactID)
            .then(() => contactReportCallback(contactId))
            .then(() => cloud.delete(`/vendors/${contactId}`));
    };

    it('should support GET /reports/metadata', () => {
        return cloud.get(`${test.api}/metadata`)
            .then(r => {
                expect(r.body).to.not.be.empty;
                expect(r.body).to.deep.equal(reportsMetadataResponse);
            });
    });

    it('should support GET /reports/:id for all standard reports', () => {
        return Promise.all(
            reports.map(report => {
                let id = report.id;
                return cloud.get(`${test.api}/${id}`)
                    .then(r => expect(r.body).to.not.be.empty);
            })
        );
    });
                
    
    it('should support GET /reports/:id for all bank account reports', () => {
        return Promise.all(
            bankAccountReports.map(report => {
                let bankAccountId;
                return cloud.get(`/ledger-accounts`)
                    .then(r => bankAccountId = r.body.filter(account => account.Type === 'BANK')[0].AccountID)
                    .then(() => cloud.withOptions({qs: {where: `${report.required[0]}='${bankAccountId}'` }}).get(`${test.api}/${report.id}`))
                    .then(r => expect(r.body.ReportID).to.equal(`${report.id}`));
            })
        );
    });
                

    
    it('should support GET /reports/:id for all contact reports', () => {
        return Promise.all(
            contactReports.map(report => {
                const contactReportCallback = (contactId) => {
                        return cloud.withOptions({qs: {where: `${report.required[0]}='${contactId}'` }}).get(`${test.api}/${report.id}`)
                        .then(r => expect(r.body.ReportID).to.equal(report.id));
                };
                return contactWrap(contactReportCallback);   
            })
        );
    });
});