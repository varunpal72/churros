'use strict';

const expect = require('chakram').expect
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const provisioner = require('core/provisioner');
const schema = require('./assets/transformation.schema');
const objDefSchema = require('./assets/objectDefinition.schema');

const genObjectDefs = () => new Object({
  'churros-object-1': genObjectDef({ objectName: 'churros-object-1'}),
  'churros-object-2': genObjectDef({ objectName: 'churros-object-2'})
});

const genObjectDef = (opts) => new Object({
  fields: [
    {
      path: 'churrosId',
      type: 'number'
    },
    {
      path: 'churrosName',
      type: 'string'
    },
    {
      path: 'churrosMod',
      type: 'string'
    }
  ]
});

const genBaseTrans = (opts) => new Object({
  vendorName: (opts.vendorName || 'Account'),
  configuration: (opts.configuration || null),
  fields: [
    {
      path: 'churrosId',
      type: 'number',
      vendorPath: 'Id',
      vendorType: 'string'
    },
    {
      path: 'churrosName',
      type: 'string',
      vendorPath: 'Name',
      vendorType: 'string'
    }
  ]
});

const genTrans = (opts) => {
  let trans = genBaseTrans(opts);
  trans.fields.push({
    path: 'churrosMod',
    type: 'string',
    vendorPath: 'LastModifiedDate',
    vendorType: 'string'
  });
  return trans;
};

const genTransWithRemove = (opts) => {
  let trans = genBaseTrans(opts);
  trans.fields.push({
    path: 'churrosMod',
    type: 'string',
    vendorPath: 'LastModifiedDate',
    vendorType: 'string',
    configuration: [
      {
        type: 'remove',
        properties: {
          fromVendor: true,
          toVendor: true
        }
      }
    ]
  });
  return trans;
};

const genTransWithPassThrough = (opts) => {
  let trans = genBaseTrans(opts);
  trans.fields.push({
    path: 'churrosMod',
    type: 'string',
    vendorPath: 'LastModifiedDate',
    vendorType: 'string',
    configuration: [
      {
        type: 'passThrough',
        properties: {
          fromVendor: false,
          toVendor: false
        }
      }
    ]
  });
  return trans;
};

const multiCrud = (url, payload, schema) => {
  let thing;
  return cloud.post(url, payload, schema)
  .then(r => thing = r.body)
  .then(r => cloud.get(url, schema))
  .then(r => cloud.delete(url));
};

const crud = (url, payload, updatePayload, schema) => {
  return cloud.post(url,  payload, schema)
    .then(r => cloud.get(url, schema))
    .then(r => cloud.put(url, updatePayload, schema))
    .then(r => cloud.delete(url));
};

const getObjectDefUrl = (level, objectName) => {
  return level + '/objects/' + objectName + '/definitions';
};

const getTransformUrl = (level, elementKey, objectName) => {
  let url = (elementKey !== undefined) ? level + '/elements/' + elementKey : level;
  return url + '/transformations/' + objectName;
};

const crudObjectDefs = (level, payload, schema) => multiCrud(level + '/objects/definitions', payload, schema);

const crudTransforms = (level, payload, schema) => multiCrud(level + '/transformations', payload, schema);

const crudObjectDefsByName = (level, payload, updatePayload, schema) => {
  let objectName = 'churros-object-' + tools.random();
  return crud(getObjectDefUrl(level, objectName), payload, updatePayload, schema);
};

const crudTransformsByName = (level, elementKey, payload, updatePayload, schema) => {
  let objectName = 'churros-object-' + tools.random();
  return cloud.post(getObjectDefUrl(level, objectName), genObjectDef({}))
  .then(r => crud(getTransformUrl(level, elementKey, objectName), payload, updatePayload, schema))
  .then(r => cloud.delete(getObjectDefUrl(level, objectName)));
};

const testTransformationForInstance = (objectName, objDefUrl, transUrl) => {
  return cloud.post(objDefUrl, genObjectDef({}))
    // test normal transformation
    .then(r => cloud.post(transUrl, genTrans({})))
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
    .then(r => cloud.delete(objDefUrl))
};

const testTransformation = (elementKey, objectName, objDefUrl, transUrl) => {
  let instanceId;
  return provisioner.create(elementKey)
    .then(r => instanceId = r.body.id)
    .then(r => testTransformationForInstance(objectName, objDefUrl, transUrl))
    .then(r => provisioner.delete(instanceId));
};

suite.forPlatform('transformations', schema, null, (test) => {
  // org level
  //it('should support org-level object definition CRUD', () => true);
  //it('should support org-level transformation CRUD', () => true);

  it('should support org-level object definition CRUD by name', () => crudObjectDefsByName('organizations', genObjectDef({}), genObjectDef({}), objDefSchema));
  it('should support org-level transformation CRUD by name', () => crudTransformsByName('organizations', 'sfdc', genTrans({}), genTrans({}), schema));
  it('should support org-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let objDefUrl = 'organizations/objects/' + objectName + '/definitions';
    let transUrl = 'organizations/elements/' + elementKey + '/transformations/' + objectName;
    return testTransformation(elementKey, objectName, objDefUrl, transUrl);
  });

  // account level
  //it('should support account-level object definitions CRUD', () => true);
  //it('should support account-level transformation CRUD', () => true);

  it('should support default account-level object definition CRUD by name', () => crudObjectDefsByName('accounts', genObjectDef({}), genObjectDef({}), objDefSchema));
  it('should support account-level object definition CRUD by name', () => {
    let accountId;
    return cloud.get('accounts')
    .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
    .then(r => crudObjectDefsByName('accounts/' + accountId, genObjectDef({}), genObjectDef({}), objDefSchema));
  });
  it('should support account-level transformation CRUD by name', () => {
    let accountId;
    return cloud.get('accounts')
    .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
    .then(r => crudTransformsByName('accounts/' + accountId, 'sfdc', genTrans({}), genTrans({}), schema));
  });
  it('should support account-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let accountId, objDefUrl, transUrl;
    return cloud.get('accounts')
    .then(r => r.body.forEach(account => accountId = (account.defaultAccount) ? accountId = account.id : accountId))
    .then(r => {
        objDefUrl = 'accounts/' + accountId + '/objects/' + objectName + '/definitions';
        transUrl = 'accounts/' + accountId + '/elements/' + elementKey + '/transformations/' + objectName;
      })
    .then(r => testTransformation(elementKey, objectName, objDefUrl, transUrl));
  });

  // instance level
  //it('should support instance-level object definitions CRUD', () => true);
  //it('should support instance-level transformation CRUD', () => true);

  it('should support instance-level object definition CRUD by name', () => {
    let instanceId;
    return provisioner.create('freshdesk')
    .then(r => instanceId = r.body.id)
    .then(r => crudObjectDefsByName('instances/' + instanceId, genObjectDef({}), genObjectDef({}), objDefSchema))
    .then(r => provisioner.delete(instanceId));
  });
  it('should support instance-level transformation CRUD by name', () => {
    let instanceId;
    return provisioner.create('freshdesk')
    .then(r => instanceId = r.body.id)
    .then(r => crudTransformsByName('instances/' + instanceId, undefined, genTrans({}), genTrans({}), schema))
    .then(r => provisioner.delete(instanceId));
  });
  it('should support instance-level transformations', () => {
    let elementKey = 'sfdc';
    let objectName = 'churros-object-' + tools.random();
    let instanceId, objDefUrl, transUrl;
    return provisioner.create(elementKey)
    .then(r => instanceId = r.body.id)
    .then(r => {
      objDefUrl = 'instances/' + instanceId + '/objects/' + objectName + '/definitions';
      transUrl = 'instances/' + instanceId + '/transformations/' + objectName;
    })
    .then(r => testTransformationForInstance(objectName, objDefUrl, transUrl))
    .then(r => provisioner.delete(instanceId));
  });
});
