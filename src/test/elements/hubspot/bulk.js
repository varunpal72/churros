'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('marketing', 'bulk', (test) => {
  test.should.supportBulkDownload({ qs: { q: 'select * from contacts where firstname = \'Kimberly\'' } });
});
