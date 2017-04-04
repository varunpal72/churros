'use strict';

const suite = require('core/suite');

suite.forElement('collaboration','testauth',(test)=>{
  test.should.return200OnGet();
});
