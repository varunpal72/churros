'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'shops', {skip: true}, (test) => {
  it('should allow retrieval of shops', () => {
    return cloud.get('/hubs/ecommerce/shops')
      .then(r => {
        expect(r).to.have.status(200);
        expect(r.body).to.be.a('array');
      });
  });
});
