/** @module core/model */
'use strict';
const tools = require('core/tools');
// todo : work on instantiating logger again
const winston = require('winston');
const swaggerParser = require('swagger-parser');
const cloud = require('core/cloud');
const props = require('core/props');

// todo : work on instantiating logger again
const logger = new (winston.Logger)({
    transports: [
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

    let element = props.get('element');
    let validatedDereferenceDocs;

    return getElementDocs(element)
        .then(r => dereference(r.body))
        .then(r => validatedDereferenceDocs = r)
        .then(r =>
            //{
            // todo : remove as below is for debug perspective
            // var fs = require('fs');
            // fs.writeFile('myjsonfile1.json', JSON.stringify(validatedDereferenceDocs) , 'utf8', function() {
            //  console.log('printed')
            // });
            //logger.debug(validatedDereferenceDocs)
            compare(pattern, validatedDereferenceDocs, apiResponse.body)
        //}
        ).catch(r => tools.logAndThrow('Failed to validate model :', r))
};

exports.validateGetModel = (apiResponse, pattern) => validateGetModel(apiResponse, pattern);

const getElementDocs = (elementkeyOrId) => {
    let elementObj;
    return cloud.get('/elements/' + elementkeyOrId)
        .then(r => elementObj = r.body)
        .then(r => cloud.get(`elements/${elementObj.id}/docs`))
};


const dereference = (docs) => {
    return new Promise((res, rej) => {
        var parser = new swaggerParser();
        res(parser.dereference(docs))
    })
}

const compare = (pattern, docs, apiResponseBody) => {
    return new Promise((res, rej) => {        
        try {
            validatedocsAgainestResponse(pattern, docs, apiResponseBody)
        } catch (ex) {
            rej(ex);
        }    
        let isDocsGetAll = Array.isArray(apiResponseBody)
        const schema = docs.paths[pattern]['get']['responses']['200']['schema']
        let logSpaces = '   '
        if (isDocsGetAll) {
            validatePrimaryKey(schema['items']['x-primary-key'])
            compareGetModelWithResponse(schema['items']['properties'], apiResponseBody[0], logSpaces)
        } else {
            validatePrimaryKey(schema['properties']['x-primary-key'])
            compareGetModelWithResponse(schema['properties'], apiResponseBody, logSpaces)
        }
        res({})
    })
}

const validatedocsAgainestResponse = (pattern, docs, apiResponseBody) => {
    // todo : optimize these may be putting validations to other functions
    if (docs.paths[pattern] === undefined) {
        throw new Error(`cannot find input pattern '${pattern}' `)
    }
    if (docs.paths[pattern]['get'] === undefined) {
        throw new Error(`cannot find get model definition in docs for '${pattern}' `)
    }
    if (docs.paths[pattern]['get']['responses'] === undefined) {
        throw new Error(`cannot find get model definition in docs for '${pattern}' `)
    }
    if (docs.paths[pattern]['get']['responses']['200'] === undefined) {
        throw new Error(`cannot find get model definition in docs for '${pattern}' `)
    }
    if(typeof apiResponseBody === undefined) {
        throw new Error(`undefined api response body '${pattern}' `)
    }
    let isDocsGetAll = Array.isArray(apiResponseBody)

    if(isDocsGetAll && apiResponseBody.length === 0  ) {        
        throw new Error(`apiResponseBody is empty array. create object first '${pattern}' `)         
    } 
    // todo: remove hardcode 'get' and write code for the same          
    // todo: check if it is getall then we should have items and its type with in it. if res is having array then it is getall
    const schema = docs.paths[pattern]['get']['responses']['200']['schema']

    if (isDocsGetAll && schema['items'] === undefined) {
        throw new Error(`models configured as object expected array '${pattern}' `)
    }

    if (!isDocsGetAll && schema['properties'] === undefined) {
        throw new Error(`models configured as array expected object '${pattern}' `)
    }
}

const validatePrimaryKey = (primaryKey) => {    
    primaryKey === undefined ?
    logger.info('Primary key is not found') : logger.info(`************ Primary key ************** : ${primaryKey}`)    
}

const compareGetModelWithResponse = (docsProperties, apiProperties, logSpaces) => {

    if (Array.isArray(apiProperties)) {
        if (apiProperties.length == 0) {
            logger.info(logSpaces, ' key is present however response array has no elements')
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
        compareGetModelWithResponse(docsProperties, apiProperties[0], doubleLogSpaces(logSpaces));
        return
    }
    if (isEmpty(docsProperties)) {
        logger.error(logSpaces, 'configured array required object')
        return
    }
    for (var i in apiProperties) {        
        if (typeof (apiProperties[i]) !== "object") {
            checkPresence(docsProperties, i, typeof (apiProperties[i]), logSpaces)
            continue;
        }
        if (docsProperties[i] === undefined) {
            logger.error(logSpaces, i, ' is not present in Model')
            continue;
        }        
        if (Array.isArray(apiProperties[i])) {
            logger.info(logSpaces, i, ': {[')
            compareGetModelWithResponse(docsProperties[i]['items'], apiProperties[i], doubleLogSpaces(logSpaces))
            logger.info(logSpaces, ']}')
            continue;
        }
        logger.info(logSpaces, i, ': {')
        compareGetModelWithResponse(docsProperties[i]['properties'], apiProperties[i], doubleLogSpaces(logSpaces));
        logger.info(logSpaces, '}')
    }
}

const doubleLogSpaces = (logSpaces) => {
    return logSpaces + logSpaces;
}

const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const checkPresence = (docsProperties, key, keyType, logSpaces) => {

    if (Object.keys(docsProperties).indexOf(key) === -1) {
        //logger.error(logSpaces, key, ' of type ', keyType, ' is not present in Model')
        logger.error(logSpaces, key, ' is not present in Model')
        return
    }
    if (docsProperties[key]['type'] === keyType) {
        logger.info(logSpaces, key, ' types are matched')
        return
    }
    logger.error(logSpaces, key, ' types but are not matched')
}
