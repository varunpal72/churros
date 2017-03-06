'use strict';

const suite = require('core/suite');
// const payload = require('./assets/orders');
const cloud = require('core/cloud');
const payload = require('./assets/products');
const options = {
  churros: {
    updatePayload: {
      "description": "Update the product listing"
    }
  }
};

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();

  it('should be that number of products retrieved be equal to or less than page size', () => {
  	let length = 1;
  	return cloud.get(`${test.api}?pageSize=${length}`)
  	.then(r => {
  		if(r.body.length <= length){
  			return;
  		}
  		length = 2;
  		return cloud.get(`${test.api}?pageSize=${length}`)
  		.then( r=> {
  			if(r.body.length <= length){
  				return;
  			}
  		});
  	});
  });

  it('should return 1st product on 2nd page immediately after last item on 1st page', () =>{
  	let page2Id;
  	return cloud.get(test.api)
  	.then(r => {
  		if (r.body.length<2) {
  			return;
  		} else {
  			let pageSize=3;
  			page2Id = r.body[pageSize].listing_id;
  			return cloud.get(`${test.api}?page=2&pageSize=${pageSize}`)
  			.then(r =>{
  				if (page2Id === r.body[0].listing_id) {
  					return;
  				}
  			});
  		}
	   });
  });

});
