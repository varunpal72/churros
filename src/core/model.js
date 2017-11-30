/** @module core/model */
'use strict';
const tools = require('core/tools');
const winston = require('winston');
const swaggerParser = require('swagger-parser');
const cloud = require('core/cloud');
const props = require('core/props');

const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            colorize: true,
            level: 'info'           
        })
    ]
});


/**
 * validate get model
 * @param  {Object} apiResponse        The API response
 * @param  {string} pattern            The local file system path to verify API
 */
const validateGetModel = (apiResponse, pattern) => {
    //logger.info(props.getForKey(element, 'oauth.api.key'))
    // validate api value and patten value.    
    let validatedDereferenceDocs;
    //return returnElementDocs('jira')
    return returnElementDocs('netsuiteerpv2')
        .then(r => dereference(r.body))
        //.then(r => validate(r))
        .then(r => validatedDereferenceDocs = r)
        //.then(r => get(api, validationCb, options))
        .then(r => {
            var fs = require('fs');
            fs.writeFile('myjsonfile1.json', JSON.stringify(validatedDereferenceDocs) , 'utf8', function() {
             console.log('printed')
            });
            logger.debug(validatedDereferenceDocs)
            compare(pattern, validatedDereferenceDocs, apiResponse.body)
        })  
        .catch(r => tools.logAndThrow('Failed to validate model :'))
};

exports.validateGetModel = (apiResponse, pattern) => validateGetModel(apiResponse, pattern);

const returnElementDocs = (elementkeyOrId) => {
    let elementObj;
    return cloud.get('/elements/' + elementkeyOrId)
        .then(r => elementObj = r.body)
        .then(r => cloud.get(`elements/${elementObj.id}/docs`))
};

// const validate = (docs) => { 
//   return new Promise((res, rej) => {
//   var definitions = Object.keys(docs.paths).map(path => {    
//     if(invalidType.indexOf(path.split('/')[1]) == -1 && 
//     Object.keys(docs.paths[path]).indexOf('get') > -1) {                               
//       return { //[path] : { 
//         "parameters" : docs.paths[path]['get']['parameters'],
//         "schema" : docs.paths[path]['get']['responses']['200']['schema'],
//         "path" : path }         
//     }
//     return null;    
//   }).filter((definition) => {       
//       return definition != null
//   })
//   //console.log(definitions)
//   res(definitions)
// })
// }


const compare = (pattern, docs, apiResponse) => {
    return new Promise((res, rej) => {
       // logger.info(Object.keys(docs.paths))
        if (docs.paths[pattern] === undefined) {
            rej(`cannot find input pattern '${pattern}' `)
        }
        // todo: remove hardcode 'get' and write code for the same  
        // todo: write error checkings
        // todo: check if it is getall then we should have items and its type with in it. if res is having array then it is getall
        const schema = docs.paths[pattern]['get']['responses']['200']['schema']
        if (Array.isArray(apiResponse)) {
            if (schema['items'] === undefined) {
                const msg = 'API returns array of objects. Model expected to be an Array'
                logger.info(msg)
                rej(msg)
            } else {
                const primaryKey = schema['items']['x-primary-key']
                primaryKey === undefined ?
                    logger.info('Primary key is not found') : logger.info(`************ Primary key ************** : ${primaryKey}`)
                //  logger.info('%j', JSON.stringify(apiResponse[0]))
                compareGetModelWithResponse(schema['items']['properties'], apiResponse[0], '   ')
                res({})
            }
        } else {
            if (schema['items'] !== undefined) {
                const msg = 'API returns object. Model expected to be an Object'
                logger.info(msg)
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

const compareGetModelWithResponse = (docsProperties, apiProperties, logSpaces) => {

    if (Array.isArray(apiProperties)) {
        if (apiProperties.length == 0) {
            logger.info(logSpaces, ' key is present but respnse array is null cannot check')
            return
        }
        if (typeof (apiProperties[0]) !== "object") {
            if (docsProperties['type'] === typeof (apiProperties[0])) {
                logger.info(logSpaces, ' types are matched')
            } else {
                logger.error(logSpaces, i, ' types are not matched')
            }
            return
        }
        compareGetModelWithResponse(docsProperties, apiProperties[0], logSpaces + '  ');
        return
    }
    for (var i in apiProperties) {
        if (typeof (apiProperties[i]) !== "object") {
            checkPresence(docsProperties, i, typeof (apiProperties[i]), logSpaces)
            continue;
        }
        if (docsProperties[i] === undefined) {
            logger.error(logSpaces, i, ' of type ', typeof (apiProperties[i]), ' is not present in Model')
            continue;
        }
        logger.info(logSpaces, i, ': {')
        Array.isArray(apiProperties[i]) ?
            compareGetModelWithResponse(docsProperties[i]['items'], apiProperties[i], logSpaces + '  ')
            : compareGetModelWithResponse(docsProperties[i]['properties'], apiProperties[i], logSpaces + '  ');
        logger.info(logSpaces, '}')
    }
}


const checkPresence = (docsProperties, key, keyType, logSpaces) => {

    if (Object.keys(docsProperties).indexOf(key) === -1) {
        logger.error(logSpaces, key, ' of type ', keyType, ' is not present in Model')
        return
    }
    if (docsProperties[key]['type'] === keyType ) {
        logger.info(logSpaces, key, ' of type ', keyType, ' present in Model types are matched')
        return
    }    
    logger.error(logSpaces, key, ' present in Model types but are not matched. model type ')
}
