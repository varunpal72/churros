'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload =tools.requirePayload(`${__dirname}/assets/accounts.json`);

suite.forElement('marketing', 'accounts',{payload: payload}, (test) =>{
    test.should.supportCrds();
});
