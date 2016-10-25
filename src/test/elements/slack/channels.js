'use strict';

const suite = require('core/suite');
const payload = require('./assets/channels');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {
  // check channel create (generally skip this one)
  it('should allow Create for public channels', () => {
    return cloud.post('/path/to/resource', {options: "true?"})
      .then(r => {expect(r.ok, true)};);
  });
  it('should allow Create for private channels', () => {
    let privateNotPublic = true;
    return cloud.post('/path/to/resource', {options: "true?"})
      .then(r => cloud.cruds(test.api, payload(privateNotPublic)))
      .then(r => cloud.delete('/path/to/resource'));
  });
  test.should.return200OnPost();
  test.withOptions({qs: {private: true}}).should.return200OnPost();
  // check channel get all
  test.should.return200OnGet();
  test.withOptions({qs: {private: true}}).should.return200OnGet();
  // check


  it('lukevance should insert some tests here :)', () => true);
});
