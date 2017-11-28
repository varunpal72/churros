
const tools = require('core/tools');
const logger = require('winston');
const swaggerParser = require('swagger-parser');
const cloud = require('core/cloud');

const validateGetModel = (apiResponse, pattern) => {  
    
    // validate api value and patten value.
    
    let validatedDereferenceDocs;
      return returnElementDocs('jira')
      .then(r => dereference(r.body))
      //.then(r => validate(r))
      .then(r => validatedDereferenceDocs = r)
      //.then(r => get(api, validationCb, options))
      .then(r => {//console.log(validatedDereferenceDocs)
        compare(pattern, validatedDereferenceDocs, apiResponse.body)    
      })      
      //.then(r => console.log(r))       
      // .then(r => { validate(r) });
  
  };
  
exports.validateGetModel = (apiResponse, pattern) =>  validateGetModel(apiResponse, pattern);

const invalidType = ['{objectName}', 'bulk', 'ping', 'objects' ];

const returnElementDocs = (elementkeyOrId) => {   
    let elementObj;
    return cloud.get('/elements/' + elementkeyOrId)
    .then(r => elementObj = r.body)    
    .then(r => cloud.get(`elements/${elementObj.id}/docs`))      
};

exports.returnElementDocs = (elementkeyOrId) =>  returnElementDocs(elementkeyOrId);

const validate = (docs) => { 
  return new Promise((res, rej) => {
  var definitions = Object.keys(docs.paths).map(path => {    
    if(invalidType.indexOf(path.split('/')[1]) == -1 && 
    Object.keys(docs.paths[path]).indexOf('get') > -1) {                               
      return { //[path] : { 
        "parameters" : docs.paths[path]['get']['parameters'],
        "schema" : docs.paths[path]['get']['responses']['200']['schema'],
        "path" : path }         
    }
    return null;    
  }).filter((definition) => {       
      return definition != null
  })
  //console.log(definitions)
  res(definitions)
})
}

exports.validate = (docs) =>  validate(docs);

const compare = (pattern, docs, apiResponse) => { 
  return new Promise((res, rej) => {
  //console.log(docs.paths[pattern])
  //console.log(docs.paths['agents'])
  if(docs.paths[pattern] === undefined) {    
      rej(`cannot find input pattern '${pattern}' `)  
  }
  // todo: remove hardcode 'get' and write code for the same  
  // todo: write error checkings
  // todo: check if it is getall then we should have items and its type with in it. if res is having array then it is getall
  const schema = docs.paths[pattern]['get']['responses']['200']['schema'] 
  if(Array.isArray(apiResponse)) {    
    if(schema['items'] === undefined) {
      const msg = 'API returns array of objects. Model expected to be an Array'
      console.log(msg)
      rej(msg)
    } else {
      const primaryKey = schema['items']['x-primary-key']
      primaryKey === undefined ? 
      console.log('Primary key is not found') : console.log(`Primary key is : ${primaryKey}`)             
      compareGetModelWithResponse(schema['items']['properties'], apiResponse[0])
    }
  } else {
    if(schema['items'] !== undefined) {
      const msg = 'API returns object. Model expected to be an Object'
      console.log(msg)
      rej(msg)      
    } else {

    }
  }
  res(null)
})
}


const dereference = (docs) => {
  return new Promise((res, rej) => {
    var parser = new swaggerParser();    
    res(parser.dereference(docs))        
  })
}

exports.dereference = (docs) =>  dereference(docs);

function traverse(o ) {
  for (i in o) {
      if (!!o[i] && typeof(o[i])=="object") {
          console.log(i, o[i])
          traverse(o[i] );
      }
  }
}  

const compareGetModelWithResponse = (docsProperties, APIProperties) => {
  
  for (var i in APIProperties) {
    if (!!APIProperties[i] && typeof(APIProperties[i])=="object") {
        //console.log(i, APIProperties[i])
        if(docsProperties[i] === undefined) {
          console.log('missing properties : ', i)
        }
        // console.log('APIProperties[i] : ', i)
        // console.log('docsProperties : ')
        // console.log(Object.keys(docsProperties))    
        compareGetModelWithResponse(docsProperties[i]['properties'] ,APIProperties[i]);
    } else {
        console.log('APIProperties[i] : ', i)
        console.log('docsProperties : ')
        console.log(Object.keys(docsProperties))
        if (Object.keys(docsProperties).indexOf(i) > -1) {
          console.log(i, ' is present in docsProperties' )
        } else {
          console.error(i, ' not present in docsProperties' )
        }

    }
  }

  // for (var i in docsProperties) {
  //   if (!!docsProperties[i] && typeof(docsProperties[i])=="object") {
  //       console.log(i, docsProperties[i])
  //       compareGetModelWithResponse(docsProperties[i]);
  //   }
  // }  
  //Object.keys(docsProperties['properties'])
}