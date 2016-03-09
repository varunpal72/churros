'use strict';

const suite = require('core/suite');
const payload = require('./assets/widgets');
const cloud = require('core/cloud');
const winston = require('winston');
const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');

const createWidget = (transientDocumentId) => ({
  "widgetCreationInfo": {
    "fileInfos": [
      {
        "transientDocumentId": transientDocumentId
      }
    ],
    "name": tools.random(),
    "signatureFlow": "SENDER_SIGNATURE_NOT_REQUIRED"
  }
});

const updateWidgetPersonalize = () => ({
	"email": tools.randomEmail()
});

const updateWidgetStatus = () => ({
	"message": "Testing widget status",
	"value": "ENABLE"
});

suite.forElement('esignature', 'widgets', null, (test) => {
	let widgetId;
	let transientDocumentId;
	let documentId;

	it('should allow POST for ' + test.api, () => {    
		return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')
		.then(r => transientDocumentId = r.body.id)
		.then(r => cloud.post(test.api,createWidget(transientDocumentId)))
		.then(r => widgetId = r.body.id)
		.then(r => cloud.get(test.api+ '/' + widgetId))
		.then(r => cloud.get(test.api+ '/' + widgetId + '/agreements'))
		.then(r => cloud.get(test.api+ '/' + widgetId + '/auditTrail'))
		.then(r => cloud.get(test.api+ '/' + widgetId + '/combinedDocument'))
		.then(r => cloud.get(test.api+ '/' + widgetId + '/formData'))
		.then(r => cloud.get(test.api+ '/' + widgetId + '/documents'))
		.then(r => documentId = r.body.documentId)
		.then(r => cloud.get(test.api + '/' + widgetId + '/documents/' + documentId))
		.then(r => cloud.patch(test.api+ '/' + widgetId + '/personalize',updateWidgetPersonalize()))
		.then(r => cloud.patch(test.api+ '/' + widgetId + '/status',updateWidgetStatus()))
		.then(r =>cloud.get(test.api))
		});


/*
	it('should allow CRUDS for /transientDocuments', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	});	
	
    return cloud.post('/hubs/ecommerce/customers', customer())
      .then(r => customerId = r.body.id)
      .then(r => cloud.post('/hubs/ecommerce/products', product))
      .then(r => productId = r.body.id)
      .then(r => cloud.post(test.api, createOrder(customerId, productId)))
      .then(r => cloud.get(test.api + '/' + r.body.id))
      .then(r => cloud.update(test.api + '/' + r.body.id, order))
      .then(r => cloud.delete('/hubs/ecommerce/orders/' + r.body.id))
      .then(r => cloud.delete('/hubs/ecommerce/customers/' + customerId))
      .then(r => cloud.delete('/hubs/ecommerce/products/' + productId));
  });
//POST
	it('should allow POST for ' + test.api, () => {    
		return cloud.post(test.api,createWidget(transientDocumentId))
		.then(r => widgetId = r.body.id)
//        .then(r => cloud.get(test.api+ '/' + widgetId)) 
  }); 	
//GET all
	it('should allow GET for ' + test.api, () => {    
		return cloud.get(test.api)   
  });
//GET /widgets/{widgetId}
	it('should allow GET for ' + test.api+'/{widgetId}', () => {  
    	return cloud.get(test.api+ '/' + widgetId)
  });
//GET /widgets/{widgetId}/agreements
	it('should allow GET for ' + test.api+'/{widgetId}/agreements', () => {  
    	return cloud.get(test.api+ '/' + widgetId + '/agreements')
  });
//GET /widgets/{widgetId}/auditTrail
	it('should allow GET for ' + test.api+'/{widgetId}/auditTrail', () => {  
    	return cloud.get(test.api+ '/' + widgetId + '/auditTrail')
  });
//GET /widgets/{widgetId}/combinedDocument
	it('should allow GET for ' + test.api+'/{widgetId}/combinedDocument', () => {  
    	return cloud.get(test.api+ '/' + widgetId + '/combinedDocument')
  });    
//GET /widgets/{widgetId}/formData
	it('should allow GET for ' + test.api+'/{widgetId}/formData', () => {  
    	return cloud.get(test.api+ '/' + widgetId + '/formData')
  });
//GET /widgets/{widgetId}/documents
	it('should allow GET for ' + test.api+'/{widgetId}/documents', () => {  
    	return cloud.get(test.api+ '/' + widgetId + '/documents')

    		.then(r => {
    		documentId = r.body.dId;
    		winston.debug(r.body.dId);
    		})
    		.then(r => cloud.get(test.api + '/' + widgetId + '/documents/' + documentId))   
   		 	
  });    
/*  
//GET /widgets/{widgetId}/documents/{documentId} 
	it('should allow GET for ' + test.api+'/{widgetId}/documents', () => {  
		let documentId
    	return cloud.get(test.api+ '/' + widgetId + '/documents')
    		.then(r => documentId = r.body.id)
    		.then(r => cloud.get(test.api + '/' + widgetId + '/documents/' + documentId))
  });  
*/   
/*
//PATCH /widgets/{widgetId}/personalize
	it('should allow PATCH for ' + test.api+'/{widgetId}/personalize', () => {  
    	return cloud.patch(test.api+ '/' + widgetId + '/personalize',updateWidgetPersonalize())
  });
//PATCH /widgets/{widgetId}/status
	it('should allow PATCH for ' + test.api+'/{widgetId}/status', () => {  
    	return cloud.patch(test.api+ '/' + widgetId + '/status',updateWidgetStatus())
  });
*/

  
});


