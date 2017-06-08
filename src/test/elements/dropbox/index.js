'use strict';

const documents = require('../assets/documents');
const suite = require('core/suite');

documents.override('search', () => {
  suite.forElement('documents', 'search', (test) => {
    test.withOptions({ qs:{'text':'abc'}}).should.return200OnGet();
  });
})
documents.all();
