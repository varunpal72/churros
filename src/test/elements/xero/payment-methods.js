'use strict';

const cloud = require('core/cloud.js');
const expect = require('chakram').expect;
const suite = require('core/suite');


suite.forElement('finance', 'payment-methods', (test) => {
    afterEach(done => {
        // to avoid rate limit errors
        setTimeout(done, 2500);
    });
    
    const paymentMethodsResponse = require('./assets/payment-methodsResponse.json');
    
    it('should support GET /payment-methods', () =>{
        return cloud.get(`${test.api}`)
        .then(r => {
            expect(r.body).to.not.be.empty;
            expect(r.body).to.deep.equal(paymentMethodsResponse);
        });
    });
    
    it('should support GET /payment-methods/:id for all payment methods', () => {
        return Promise.all(
            paymentMethodsResponse.map(method => {
                return cloud.get(`${test.api}/${method.id}`)
                .then(r => {
                    expect(r.body).to.not.be.empty;
                    expect(r.body.id).to.equal(method.id);
                });       
            })
        );
    });
});