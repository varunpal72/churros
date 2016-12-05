'use strict';

const suite = require('core/suite');

suite.forElement('marketing','campaigns',null, (test) => {
  it('should allow SR for /campaigns ', () => {
    test.should.supportSr();
      
 });
});
