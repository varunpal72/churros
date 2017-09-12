'use strict';

const account = require('./assets/account');
const accountSchema = require('./assets/account.schema');
const accountsSchema = require('./assets/accounts.schema');
const chakram = require('chakram');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forPlatform('accounts', { payload: account, schema: accountSchema }, (test) => {

  test.should.supportCrud();
  test.withOptions({ schema: accountsSchema }).should.supportS();
  test.should.supportCeqlSearch('name');
  test.should.return404OnDelete(-1);
  test.should.return404OnPatch(-1);
  test.should.return404OnGet(-1);

  let roleKey = 'admin';
  let payload = {
    key: roleKey
  };

  describe('account roles', () => {
    let accountId;
    before(() => {
      return cloud.post(`/accounts/`, account)
        .then(r => {
          accountId = r.body.id;
          console.log(`Account ID: ${accountId}`);
        });
    });

    test.withApi(`/accounts/${accountId}/roles`).should.supportCrd();

    it.skip('should support granting admin role by admin account', () => {
      return cloud.get('/accounts')
        .then(r => {
          expect(r.body.length).to.be.at.least(1) &&
            expect(r.body[0]).to.contain.key('defaultAccount') &&
            expect(r.body[0].defaultAccount).to.equal(true);
          accountId = r.body[0].id;
        })
        .then(r => cloud.post(`/accounts/${accountId}/roles`, payload)
          .then(r => expect(r).to.have.statusCode(200))
          .then(r => cloud.delete(`/accounts/${accountId}/roles/${roleKey}`)));
    });
  });


  after(() =>
    chakram.get('/accounts')
    .then(r => Promise.all(r.body.filter(a => !a.defaultAccount).map(a => chakram.delete(`/accounts/${a.id}`))))
  );
});
