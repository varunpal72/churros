'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration','objects',(test) => {
  it(`should allow GET /{test.api}/:objectName`,()=>{
    let objectName;
    return cloud.get(test.api)
    .then(r=> objectName=r.body[0])
    .then(r=> cloud.get(`${test.api}/${objectName}/metadata`));
  });
});
