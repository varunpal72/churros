'use strict';

const cloud = require('core/cloud.js');
const expect = require('chakram').expect;
const suite = require('core/suite');


suite.forElement('finance', 'ledger-accounts', (test) => {

    it('should support RS for /ledger-accounts', () => {
        let name, id;

        return cloud.get(test.api)
            .then(r => id = r.body[0].AccountID)
            .then(() => cloud.get(`${test.api}/${id}`))
            .then(r => {
                expect(r.body).to.not.be.empty; 
                name = r.body.Name;
            })
            .then(() => cloud.withOptions({ qs: { where: `Name='${name}'`}}).get(test.api))
            .then(r => {
                expect(r.body.length).to.equal(1);
                expect(r.body[0].Name).to.equal(name);
            })
            .then(() => cloud.get(test.api))
            .then(r => expect(r.body.length).to.be.at.least(2))
            .then(() => cloud.withOptions({qs: { page: 2, pageSize: 1}}).get(test.api))
            .then(r => expect(r.body.length).to.equal(1));
    });
});