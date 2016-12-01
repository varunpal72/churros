'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
suite.forElement('marketing', 'tagTypes', (test) => {
  let tagType ;
  test.should.supportPagination();
   return cloud.get(test.api)
	.then( r => tagType = r.body[0].tagType)
  	.then(r =>  cloud.get(`${test.api}/${tagType}`)
  	.then(r => test.withApi(`${test.api}/${tagType}`).should.supportPagination()));
});
