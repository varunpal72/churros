'use strict';
const tools = require('core/tools');
const cloud = require('core/cloud');
const suite = require('core/suite');
exports.search = () => {
  suite.forElement('documents', 'search', (test) => {

    test.withOptions({ qs:{'text':'abc'}}).should.return200OnGet();
  });
};
