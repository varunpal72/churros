'use strict';

const suite = require('core/suite');
const payload = require('./assets/smart-collection.json');

suite.forElement('ecommerce', 'smart-collections', { payload: payload }, (test) => {
    test.should.supportCruds();
});
