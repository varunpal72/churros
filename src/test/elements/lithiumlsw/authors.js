'use strict';

const suite = require('core/suite');
const payload = require('./assets/authors');
const tools = require('core/tools');

payload.handles.crm[0].id = tools.random();
payload.handles.crm[0].id = tools.randomEmail();

suite.forElement('social', 'authors', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withApi('/hubs/social/authors/changes').withOptions({qs: {where: 'startEpochMillis=1470174284000'}}).should.return200OnGet();
});
