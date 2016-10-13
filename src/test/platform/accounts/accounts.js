'use strict';

const account = require('./assets/account');
const accountSchema = require('./assets/account.schema');
const accountsSchema = require('./assets/accounts.schema');
const chakram = require('chakram');
const suite = require('core/suite');

suite.forPlatform('accounts', {payload: account, schema: accountSchema}, (test) => {
  test.should.supportCrud();
  test.should.supportCeqlSearch('name');
  test.should.return404OnDelete(-1);
  test.should.return404OnPatch(-1);
  test.should.return404OnGet(-1);

  suite.forPlatform('accounts', {payload: account, schema: accountsSchema}, (test) => {
    test.should.supportS();
  });

  afterEach(() =>
    chakram.get('/accounts')
      .then(r => Promise.all(r.body.filter(a => !a.defaultAccount).map(a => chakram.delete(`/accounts/${a.id}`))))
  );
});
