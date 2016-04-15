'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const customCollection = () => ({
  "title": tools.random()
});

suite.forElement('ecommerce', 'custom-collections', { payload: customCollection({}) }, (test) => {
  test.should.supportCruds();
  test.withApi(`/hubs/ecommerce/custom-collections-count`).should.return200OnGet();
});
