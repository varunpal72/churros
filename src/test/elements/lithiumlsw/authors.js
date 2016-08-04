'use strict';

const suite = require('core/suite');
const payload = require('./assets/authors');
const tools = require('core/tools');
const cloud = require('core/cloud');

payload.handles.crm[0].id = tools.random();
payload.handles.crm[0].id = tools.randomEmail();

suite.forElement('social', 'authors', { payload: payload }, (test) => {
  test.should.supportCrus();

  it('should allow get for /authors/changes', () => {
    return cloud.get('/hubs/social/authors/changes?startEpochMillis=1470174284000');
  });

  it('should allow get for /persons/:id', () => {
    let personId;
    return cloud.get('/hubs/social/authors?pageSize=1')
      .then(r => personId = r.body[0].id)
      .then(r => cloud.get(`/hubs/social/persons/${personId}`));
  });

});
