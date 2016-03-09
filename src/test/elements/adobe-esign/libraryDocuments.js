'use strict';

const suite = require('core/suite');
//const payload = require('./assets/libraryDocuments');
const chakram = require('chakram');
const cloud = require('core/cloud');
const winston = require('winston');
const tools = require('core/tools');
const expect = chakram.expect;

const createLibraryDocuments = (transientDocumentId) => ({	
	  "libraryDocumentCreationInfo": {
	    "libraryTemplateTypes": "DOCUMENT",
		"fileInfos": [
			{
				"transientDocumentId": transientDocumentId
			}
	    ],
	    "name": tools.random(),
	    "librarySharingMode": "USER"
	  },
	  "options": {
	    "noChrome": false,
	    "authoringRequested": false,
	    "autoLoginUser": false
	  }
});

suite.forElement('esignature', 'libraryDocuments', null, (test) => {
	let libraryDocumentId;
	let transientDocumentId;
	let documentId;
/*
	it('should allow CRUDS for /transientDocuments', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api+ '/' + libraryDocumentId))
/*
      .then(r => {
      transientDocumentId = r.body.id;
      winston.debug(r.body.id);
      })
   
	  });*/
	   
	it('should allow GET /libraryDocuments/{libraryDocumentId}  ', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api+'/'+ libraryDocumentId))
      .then(r => expect(r).to.have.statusCode(200))
      });
	it('should allow GET /libraryDocuments/{libraryDocumentId}/auditTrail', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api+'/'+libraryDocumentId+'/auditTrail'))
      .then(r => expect(r).to.have.statusCode(200))
      });
	it('should allow GET /libraryDocuments/{libraryDocumentId}/documents', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api+'/'+libraryDocumentId+'/documents'))
      .then(r => expect(r).to.have.statusCode(200))
      });
	it('should allow GET /libraryDocuments/{libraryDocumentId}/documents/{documentId}', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api+'/'+libraryDocumentId+'/documents'))
      .then(r => expect(r).to.have.statusCode(200))
      .then(r => documentId = r.body.documentId)
      .then(r => expect(r).to.have.statusCode(200))
      .then(r => cloud.get(test.api+'/'+libraryDocumentId+'/documents/'+documentId))
      .then(r => expect(r).to.have.statusCode(200))      
      });            
	it('should allow GET all', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => libraryDocumentId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => expect(r).to.have.statusCode(200))  
      });   
	it('should allow GET /libraryDocuments/{libraryDocumentId}/combinedDocument', () => {
	var libraryDocumentId = "";
	var transientDocumentId = "";
	var documentId = "";
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	  .then(r => {
        return new Promise((res, rej) => {
          setTimeout(() => res(), 5000);
        });
      })
	  .then(r => cloud.post(test.api,createLibraryDocuments(transientDocumentId)))
	  .then(r => {
        return new Promise((res, rej) => {
          setTimeout(() => res(), 5000);
        });
      })
	  .then(r => {
	  libraryDocumentId = r.body.id;
	  winston.debug(r.body.id);
	  })	
	  .then(r => {
        return new Promise((res, rej) => {
          setTimeout(() => res(), 5000);
        });
      })
      .then(r => cloud.get(test.api+'/'+libraryDocumentId+'/combinedDocument'))
      .then(r => {
        return new Promise((res, rej) => {
          setTimeout(() => res(), 5000);
        });
      })
      .then(r => expect(r).to.have.statusCode(200))
      }); 
      
      //3AAABLblqZhBd_wUe4Rg6HiEHc8DlamoCI8FdX5-kcfp1yVabRWYiXOIa98VeMaInQ69uNOlvFBZQ37R7_3duxDzMbuu853ro         
/*      
    

      });
      
      
/*	

	it('should allow CRUDS for /transientDocuments', () => {
    return cloud.postFile('/hubs/esignature/transientDocuments', __dirname + '/assets/attach.txt')	
	  .then(r => transientDocumentId = r.body.id)
	});	
//POST /libraryDocuments
	it('should allow POST for ' + test.api, () => {    
		return cloud.post(test.api,createLibraryDocuments(transientDocumentId))
		.then(r => libraryDocumentId = r.body.id)
        .then(r => cloud.get(test.api+ '/' + libraryDocumentId)) 
  }); 	
//GET all
	it('should allow GET for ' + test.api, () => {    
		return cloud.get(test.api)   
  });
//GET /libraryDocuments/{libraryDocumentId}  
	it('should allow GET for ' + test.api+'/'+libraryDocumentId, () => {    
		return cloud.get(test.api)   
  });
//GET /libraryDocuments/{libraryDocumentId}/auditTrail
	it('should allow GET for ' + test.api+'/{libraryDocumentId}'+'/auditTrail', () => {  
    	return cloud.get(test.api+'/'+libraryDocumentId+'/auditTrail')
  });
//GET /libraryDocuments/{libraryDocumentId}/combinedDocument
	it('should allow GET for ' + test.api+'/{libraryDocumentId}'+'/combinedDocument', () => {  
    	return cloud.get(test.api+'/'+libraryDocumentId+'/combinedDocument')
  });

//GET /libraryDocuments/{libraryDocumentId}/documents
	it('should allow GET for ' + test.api+'/{libraryDocumentId}'+'/documents', () => {  
    	return cloud.get(test.api+ '/' + libraryDocumentId+'/documents')
//    	.then(r => {
//    	documentId = r.body.dId;
//    	winston.debug(r.body.dId);
//    	})
  });
/*  
//GET /libraryDocuments/{libraryDocumentId}/documents/{documentId}
//	it('should allow GET for ' + test.api+'/{libraryDocumentId}'+'/combinedDocument', () => {  
//    	return cloud.get(test.api+ '/' + libraryDocumentId+'/combinedDocument')
//  });
*/
    
});