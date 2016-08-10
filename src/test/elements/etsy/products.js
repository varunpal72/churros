'use strict';

const suite = require('core/suite');
// const payload = require('./assets/orders');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'products', {}, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
 
  it('should retrieve correct resource by ID', () => {
  	// test.withApi(`${test.api}/count`).;
  	let orderId;
  	return cloud.get(`${test.api}`)
  	.then(r => {
  		if (r.body.length <= 0){
  			return;
  		}
  		orderId = r.body[0].listing_id;
  		return cloud.get(`${test.api}/${orderId}`);
  	});
  });

  it('should retrieve all resources', () => {
  	return cloud.get(`${test.api}`);
  });

  it('should be that number of products retrieved be equal to or less than page size', () => {
  	let length = 200;
  	return cloud.get(`${test.api}?pageSize=${length}`)
  	.then(r => {
  		if(r.body.length <= length){
  			return;
  		}
  		length = 2;
  		return cloud.get('${test.api}?pageSize=${length}')
  		.then( r=> {
  			if(r.body.length <= length){
  				return;
  			}
  		});	
  		
  	});

  });

  it('should return 1st product on 2nd page immediately after last item on 1st page', () =>{
  	let page2Id;
  	return cloud.get(`${test.api}`)
  	.then(r => {
  		if(r.body.length<2){
  			return;
  		}else{
  			let pageSize=3;
  			page2Id = r.body[pageSize].listing_id;
  			return cloud.get(`${test.api}?page=2&pageSize=${pageSize}`)
  			.then(r =>{
  				if (page2Id === r.body[0].listing_id){
  					return;
  				}
  			});
  		}
	});
  });
  // nextPageToken is returning last page
  // it('should page through all pages', () => {
  // 	let nextPageToke = ''
  // 	returncloud.get(`${test.api}`)
  // 	.then(r => {
  // 		nextPageToke = r.header.elements-next-page-token;
  // 		while(nextPageToke !== null){

  // 		}


  // })

});


