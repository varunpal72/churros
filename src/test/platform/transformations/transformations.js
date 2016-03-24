'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const provisioner = require('core/provisioner');
const schema = require('./assets/transformation.schema');
const objDefSchema = require('./assets/objectDefinition.schema');

const getConfig = (type, from, to) => ({
  type: type,
  properties: {
    fromVendor: from,
    toVendor: to
  }
});

const getObjDefField = (path, type) => ({ path: path, type: type });

const addObjDefField = (objDef, path, type) => objDef.fields.push(getObjDefField(path, type));

const genBaseObjectDef = (opts) => ({
  fields: (opts.fields) || [{
    path: 'churrosId',
    type: 'number'
  }]
});

const genDefaultObjectDef = (opts) => {
  let objDef = genBaseObjectDef(opts);
  addObjDefField(objDef, 'churrosName', 'string');
  addObjDefField(objDef, 'churrosMod', 'string');
  return objDef;
};

const getTransField = (path, type, vendorPath, vendorType, configuration) => ({ path: path, type: type, vendorPath: vendorPath, vendorType: vendorType, configuration: configuration });

const addTransField = (trans, path, type, vendorPath, vendorType, configuration) => trans.fields.push(getTransField(path, type, vendorPath, vendorType, configuration));

const genBaseTrans = (opts) => ({
  vendorName: (opts.vendorName || 'Account'),
  configuration: (opts.configuration || null),
  fields: (opts.fields) || [{
    path: 'churrosId',
    type: 'number',
    vendorPath: 'Id',
    vendorType: 'string'
  }]
});

const genDefaultTrans = (opts) => {
  let trans = genBaseTrans(opts);
  addTransField(trans, 'churrosName', 'string', 'Name', 'string');
  addTransField(trans, 'churrosMod', 'string', 'LastModifiedDate', 'string');
  return trans;
};

const genTransWithRemove = (opts) => {
  let trans = genBaseTrans(opts);
  addTransField(trans, 'churrosName', 'string', 'Name', 'string');
  addTransField(trans, 'churrosMod', 'string', 'LastModifiedDate', 'string', [{
    type: 'remove',
    properties: {
      fromVendor: true,
      toVendor: true
    }
  }]);
  return trans;
};

const genTransWithPassThrough = (opts) => {
  let trans = genBaseTrans(opts);
  addTransField(trans, 'churrosName', 'string', 'Name', 'string');
  addTransField(trans, 'churrosMod', 'string', 'LastModifiedDate', 'string', [{
    type: 'passThrough',
    properties: {
      fromVendor: false,
      toVendor: false
    }
  }]);
  return trans;
};

const crud = (url, payload, updatePayload, schema) => {
  return cloud.post(url, payload, schema)
    .then(r => cloud.get(url, schema))
    .then(r => cloud.put(url, updatePayload, schema))
    .then(r => cloud.delete(url));
};

const getObjectDefUrl = (level, objectName) => {
  return level + '/objects/' + objectName + '/definitions';
};

const getTransformUrl = (level, objectName, elementKey) => {
  let url = (elementKey !== undefined) ? level + '/elements/' + elementKey : level;
  return url + '/transformations/' + objectName;
};

const crudObjectDefsByName = (level, payload, updatePayload, schema) => {
  let objectName = 'churros-object-' + tools.random();
  return crud(getObjectDefUrl(level, objectName), payload, updatePayload, schema);
};

const crudTransformsByName = (level, elementKey, payload, updatePayload, schema) => {
  let objectName = 'churros-object-' + tools.random();
  return cloud.post(getObjectDefUrl(level, objectName), genDefaultObjectDef({}))
    .then(r => crud(getTransformUrl(level, objectName, elementKey), payload, updatePayload, schema))
    .then(r => cloud.delete(getObjectDefUrl(level, objectName)));
};

const testTransformationForInstance = (objectName, objDefUrl, transUrl) => {
  return cloud.post(objDefUrl, genDefaultObjectDef({}))
    // test normal transformation
    .then(r => cloud.post(transUrl, genDefaultTrans({})))
    .then(r => cloud.get('hubs/crm/' + objectName, r => {
      expect(r.body).to.not.be.empty;
      r.body.forEach(item => {
        expect(item.churrosId).to.not.be.empty;
        expect(item.churrosName).to.not.be.empty;
        expect(item.churrosMod).to.not.be.empty;
      });
    }))
    // test remove config
    .then(r => cloud.put(transUrl, genTransWithRemove({})))
    .then(r => cloud.get('hubs/crm/' + objectName, r => {
      expect(r.body).to.not.be.empty;
      r.body.forEach(item => {
        expect(item.churrosMod).to.be.empty;
      });
    }))
    // test passThrough config
    .then(r => cloud.put(transUrl, genTransWithPassThrough({})))
    .then(r => cloud.get('hubs/crm/' + objectName, r => {
      expect(r.body).to.not.be.empty;
      r.body.forEach(item => {
        expect(item.churrosMod).to.be.empty;
      });
    }))
    .then(r => cloud.delete(transUrl))
    .then(r => cloud.delete(objDefUrl));
};

const testTransformation = (elementKey, objectName, objDefUrl, transUrl) => {
  let instanceId;
  return provisioner.create(elementKey)
    .then(r => instanceId = r.body.id)
    .then(r => testTransformationForInstance(objectName, objDefUrl, transUrl))
    .then(r => provisioner.delete(instanceId));
};

suite.forPlatform('transformations', schema, null, (test) => {
  /** org-level */
  it('should support org-level object definition CRUD by name', () => crudObjectDefsByName('organizations', genDefaultObjectDef({}), genDefaultObjectDef({}), objDefSchema));
  it('should support org-level transformation CRUD by name', () => crudTransformsByName('organizations', 'sfdc', genDefaultTrans({}), genDefaultTrans({}), schema));
  it('should support org-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    return testTransformation(elementKey, objectName, getObjectDefUrl('organizations', objectName), getTransformUrl('organizations', objectName, elementKey));
  });

  /** account-level */
  it('should support default account-level object definition CRUD by name', () => crudObjectDefsByName('accounts', genDefaultObjectDef({}), genDefaultObjectDef({}), objDefSchema));
  it('should support account-level object definition CRUD by name', () => {
    let accountId;
    return cloud.get('accounts')
      .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
      .then(r => crudObjectDefsByName('accounts/' + accountId, genDefaultObjectDef({}), genDefaultObjectDef({}), objDefSchema));
  });
  it('should support account-level transformation CRUD by name', () => {
    let accountId;
    return cloud.get('accounts')
      .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
      .then(r => crudTransformsByName('accounts/' + accountId, 'sfdc', genDefaultTrans({}), genDefaultTrans({}), schema));
  });
  it('should support account-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let accountId, level;
    return cloud.get('accounts')
      .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
      .then(r => level = 'accounts/' + accountId)
      .then(r => testTransformation(elementKey, objectName, getObjectDefUrl(level, objectName), getTransformUrl(level, objectName, elementKey)));
  });

  /** instance-level */
  it('should support instance-level object definition CRUD by name', () => {
    let instanceId;
    return provisioner.create('sfdc')
      .then(r => instanceId = r.body.id)
      .then(r => crudObjectDefsByName('instances/' + instanceId, genDefaultObjectDef({}), genDefaultObjectDef({}), objDefSchema))
      .then(r => provisioner.delete(instanceId));
  });
  it('should support instance-level transformation CRUD by name', () => {
    let instanceId;
    return provisioner.create('sfdc')
      .then(r => instanceId = r.body.id)
      .then(r => crudTransformsByName('instances/' + instanceId, undefined, genDefaultTrans({}), genDefaultTrans({}), schema))
      .then(r => provisioner.delete(instanceId));
  });
  it('should support instance-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let instanceId, level;
    return provisioner.create(elementKey)
      .then(r => instanceId = r.body.id)
      .then(r => level = 'instances/' + instanceId)
      .then(r => testTransformationForInstance(objectName, getObjectDefUrl(level, objectName), getTransformUrl(level, objectName)))
      .then(r => provisioner.delete(instanceId));
  });

  it('should support transformation inheritance', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let instanceId, accountId;
    return provisioner.create(elementKey)
      .then(r => instanceId = r.body.id)
      .then(r => cloud.post(getObjectDefUrl('organizations', objectName), genBaseObjectDef({})))
      .then(r => cloud.post(getTransformUrl('organizations', objectName, elementKey), genBaseTrans({})))
      .then(r => cloud.get('hubs/crm/' + objectName, r => {
        expect(r.body).to.not.be.null;
        r.body.forEach(item => {
          expect(item.churrosId).to.not.be.empty;
          expect(item.churrosName).to.be.undefined;
          expect(item.churrosMod).to.be.undefined;
        });
      }))
      // create account-level obj def and trans for name field
      .then(r => cloud.get('accounts'))
      .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
      .then(r => {
        let objDef = genBaseObjectDef({ fields: [getObjDefField('churrosName', 'string')] });
        return cloud.post(getObjectDefUrl('accounts/' + accountId, objectName), objDef);
      })
      .then(r => {
        let trans = genBaseTrans({ fields: [getTransField('churrosName', 'string', 'Name', 'string')], configuration: [getConfig('inherit', true, true)] });
        return cloud.post(getTransformUrl('accounts/' + accountId, objectName, elementKey), trans);
      })
      .then(r => cloud.get('accounts/' + accountId + '/elements/' + elementKey + '/transformations/' + objectName, r => {
        expect(r.body).to.not.be.null;
        let foundId = false,
          foundName = false;
        r.body.fields.forEach(field => {
          foundId = foundId || (field.path === 'churrosId');
          foundName = foundName || (field.path === 'churrosName');
        });
        expect(foundId);
        expect(foundName);
      }))
      .then(r => cloud.get('hubs/crm/' + objectName, r => {
        expect(r.body).to.not.be.null;
        r.body.forEach(item => {
          expect(item.churrosId).to.not.be.empty;
          expect(item.churrosName).to.not.be.empty;
          expect(item.churrosMod).to.be.undefined;
        });
      }))
      // create instance-level obj def and trans for mod field
      .then(r => {
        let objDef = genBaseObjectDef({ fields: [getObjDefField('churrosMod', 'string')] });
        return cloud.post(getObjectDefUrl('instances/' + instanceId, objectName), objDef);
      })
      .then(r => {
        let trans = genBaseTrans({ fields: [getTransField('churrosMod', 'string', 'LastModifiedDate', 'string')], configuration: [getConfig('inherit', true, true)] });
        return cloud.post(getTransformUrl('instances/' + instanceId, objectName), trans);
      })
      .then(r => cloud.get('instances/' + instanceId + '/transformations/' + objectName, r => {
        expect(r.body).to.not.be.null;
        let foundId = false,
          foundName = false,
          foundMod = false;
        r.body.fields.forEach(field => {
          foundId = foundId || (field.path === 'churrosId');
          foundName = foundName || (field.path === 'churrosName');
          foundMod = foundMod || (field.path === 'churrosMod');
        });
        expect(foundId);
        expect(foundName);
        expect(foundMod);
      }))
      .then(r => cloud.get('hubs/crm/' + objectName, r => {
        expect(r.body).to.not.be.null;
        r.body.forEach(item => {
          expect(item.churrosId).to.not.be.empty;
          expect(item.churrosName).to.not.be.empty;
          expect(item.churrosMod).to.not.be.empty;
        });
      }))
      // clean up!
      .then(r => cloud.delete(getTransformUrl('instances/' + instanceId, objectName)))
      .then(r => cloud.delete(getObjectDefUrl('instances/' + instanceId, objectName)))
      .then(r => cloud.delete(getTransformUrl('accounts/' + accountId, objectName, elementKey)))
      .then(r => cloud.delete(getObjectDefUrl('accounts/' + accountId, objectName)))
      .then(r => cloud.delete(getTransformUrl('organizations', objectName, elementKey)))
      .then(r => cloud.delete(getObjectDefUrl('organizations', objectName)))
      .then(r => provisioner.delete(instanceId));
  });
});
