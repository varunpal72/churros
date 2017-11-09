'use strict';

const cloud = require('core/cloud.js');
const expect = require('chakram').expect;
const suite = require('core/suite');


suite.forElement('finance', 'ledger-accounts', (test) => {
    let id; 

    it('should support RS', () => {
        return cloud.get(test.api)
            .then(r => id = r.body[0].AccountID)
            .then(() => cloud.get(`${test.api}/${id}`))
            .then(r => expect(r.body).to.not.be.empty);
    });
});