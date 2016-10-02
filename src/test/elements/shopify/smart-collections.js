'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/smart-collection.json');
const smartCollectionUpdate = {"title": "MyCollection"};

suite.forElement('ecommerce', 'smart-collections', { payload: payload }, (test) => {
    test.should.supportCruds();
});
