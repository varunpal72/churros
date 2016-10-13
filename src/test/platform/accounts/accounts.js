'use strict';

const account = require('./assets/account');
const accountSchema = require('./assets/account.schema');
const accountsSchema = require('./assets/accounts.schema');
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;
const suite = require('core/suite');

suite.forPlatform('accounts', {payload: account, schema: accountSchema}, (test) => {
  test.should.supportCrud();
  test.should.return404OnDelete(-1);
  test.should.return404OnGet(-1);

  it('should support getting an account by query', () =>
    cloud.post('/accounts', account)
      .then(() => cloud.get(`/accounts?where=name='churros'`))
      .then(r => expect(r.body.filter(a => a.name === 'churros')).to.have.length(1))
  );

  afterEach(() =>
    chakram.get('/accounts')
      .then(r => Promise.all(r.body.filter(a => !a.defaultAccount).map(a => chakram.delete(`/accounts/${a.id}`))))
  );
});
