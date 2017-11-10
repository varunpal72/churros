'use strict';

const cloud = require('core/cloud.js');
const expect = require('chakram').expect;
const suite = require('core/suite');
const random = require('core/tools.js').randomStr;

suite.forElement('finance', 'reports', (test) => {
    let reports = [];
    let reportsWithRequiredField = [];
    let contactReports = [];
    let bankAccountReports = [];

    it('should support GET /reports/metadata', () => {
        return cloud.get(`${test.api}/metadata`)
            .then(r => {
                expect(r.body).to.not.be.empty;
                reports = r.body.filter(report => report.required.length === 0);
                expect(reports).to.not.be.empty;
                contactReports = r.body.filter(report => report.required[0] === 'contactId');
                expect(contactReports).to.not.be.empty;
                bankAccountReports = r.body.filter(report => report.required[0] === 'bankAccountId');
                expect(bankAccountReports).to.not.be.empty;
            })
    });

    
    reports.forEach(report => {
        it(`should support GET /reports/${report.id}`, () => {
            id = report.id;
            return cloud.get(`${test.api}/${id}`)
                .then(r => expect(r).to.not.be.empty);
        });
    });
                
    bankAccountReports.forEach(report => {
        it(`should support S for /reports/${report.id}`, () => {
            let bankAccountId;
            return cloud.get(`/ledger-accounts`)
            .then(r => bankAccuntId = r.filter(account => account.Type === 'BANK')[0].AccountID)
            .then(() => cloud.withOptions({qs: {where: `${report.required[0]}='${bankAccountId}'` }}).get(`${test.api}/${report.id}`))
            .then(r => expect(r.body.ReportID).to.equal(`${report.id}`))
        })
    });
                

    contactReports.forEach(report => {
        it('should support S for /reports/:id', () => {
            const contactWrap = (contactReportCallback) => {
                let contactId;
                let vendorPayload = require('./assets/contact.json');    
                vendorPayload.Name = 'churros-' + random('1234567890abcdefghij', 8);
                return cloud.post('/vendors', vendorPayload)
                    .then(r => contactId = r.body.ContactID)
                    .then(r => contactReportCallback(contactId))
                    .then(() => cloud.delete(`/vendors/${vendor.ContactID}`));
            };

            const contactReportCallback = (contactId) => {
                    return cloud.withOptions({qs: {where: `${report.required[0]}='${contactId}'` }}).get(`${test.api}/${report.id}`)
                    .then(r => expect(r.body.ReportID).to.equal(`${report.id}`))
            }
            contactWrap(contactReportCallback);   
        });
    });
});