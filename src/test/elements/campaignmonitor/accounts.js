'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/accounts');


payload.CompanyName = tools.random();

suite.forElement('marketing', 'accounts',{payload: payload}, (test) =>{
    test.should.supportCrds()
});
