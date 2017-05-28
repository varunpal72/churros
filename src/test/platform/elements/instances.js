'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const instanceSchema = require('./assets/element.instance.schema');
const instancesSchema = require('./assets/element.instances.schema');
const transformationPayload = require('./assets/accountTransformation');
const objDefPayload = require('./assets/accountObjectDefinition');
const sfdcSwaggerSchema = require('./assets/sfdcSwagger.schema');
const logger = require('winston');

const genInstance = (element, o) => ({
  name: (o.name || 'churros-instance'),
  providerData: (o.providerData || undefined),
  element: { key: element },
  configuration: props.all(element)
});

const crudsInstance = (baseUrl) => {
  let id;
  return provisioner.create('jira', undefined, baseUrl)
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(instanceSchema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('jira', 'username'));
    }))
    .then(r => cloud.get(`${baseUrl}`, instancesSchema))
    .then(r => expect(r.body.length).to.be.above(0))
    .then(r => cloud.put(`${baseUrl}/${id}`, genInstance('jira', { name: 'updated-instance' })))
    .then(r => provisioner.delete(id, baseUrl));
};

const updateInstanceWithReprovision = (baseUrl, schema) => {
  let id;
  return provisioner.create('shopify')
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(schema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
    }))
    .then(r => provisioner.partialOauth('shopify'))
    .then(code =>
      cloud.put(`${baseUrl}/${id}`, genInstance('shopify', { name: 'updated-instance', providerData: { code: code } }), r => {
        expect(r.body.configuration).to.not.be.empty;
        expect(r.body.configuration.password).to.equal("********");
        expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
        expect(r.body).to.not.have.key('providerData');
      }))
    .then(r => cloud.get(`/hubs/ecommerce/orders`))
    .then(r => expect(r.body).to.be.instanceof(Array))
    .then(r => provisioner.partialOauth('shopify'))
    .then(code => cloud.patch(`${baseUrl}/${id}`, { name: 'updated-instance', providerData: { code: code } }, r => {
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
      expect(r.body).to.not.have.key('providerData');
    }))
    .then(r => cloud.get(`/hubs/ecommerce/orders`))
    .then(r => expect(r.body).to.be.instanceof(Array))
    .then(r => provisioner.delete(id, baseUrl));
};

const opts = { schema: instanceSchema };

suite.forPlatform('elements/instances', opts, (test) => {
  let sfdcId;
  before(() => {
    return provisioner.create('sfdc')
      .then(r => sfdcId = r.body.id);
  });

  after(() => {
    return sfdcId ? provisioner.delete(sfdcId) : true;
  });

  it('should support using filter.response.nulls config to filter out or display nulls', () => {
    const validate = (r) => {
      expect(r.body.length).to.be.above(0);
      return r.body.filter(config => config.key === 'filter.response.nulls')[0];
    };

    const validateNullsPresent = (shouldHaveNulls) => {
      return cloud.get('hubs/crm/contacts?pageSize=1')
        .then(r => {
          let keys = Object.keys(r.body[0]);
          return keys.filter(key => r.body[0][key] === null);
        })
        .then(r => expect(r.length > 0).to.equal(shouldHaveNulls));
    };

    let configuration;

    return cloud.get(`/instances/${sfdcId}/configuration`)
      .then(r => validate(r))
      .then(r => {
        configuration = r;
        expect(configuration.propertyValue).to.equal('true');
      })
      .then(r => validateNullsPresent(false))

      .then(r => cloud.patch(`/instances/${sfdcId}/configuration/${configuration.id}`, Object.assign({}, configuration, { propertyValue: 'false' })))
      .then(r => cloud.get(`/instances/${sfdcId}/configuration/${r.body.id}`))
      .then(r => expect(r.body.propertyValue).to.equal('false'))
      .then(r => validateNullsPresent(true));
  });

  it('should support CRUD by key', () => crudsInstance('elements/jira/instances'));

  it('should support CRUD by ID', () => {
    return cloud.get('elements/jira')
      .then(r => crudsInstance(`elements/${r.body.id}/instances`));
  });

  it('should support search tags', () => {
    return cloud.withOptions({ qs: { 'tags[]': 'churros-instance' } }).get('instances')
      .then(r => {
        r.body.map(s => {
          expect(s.tags.includes('churros-instance')).to.equal(true);
        });
      });
  });


  it('should support update with reprovision by key', () => updateInstanceWithReprovision('/instances', instanceSchema));

  it('should support get instance specific docs', () => {
    return cloud.post(`instances/${sfdcId}/objects/myaccounts/definitions`, objDefPayload)
      .then(r => cloud.post(`instances/${sfdcId}/transformations/myaccounts`, transformationPayload))
      .then(r => cloud.get(`instances/${sfdcId}/docs`, sfdcSwaggerSchema));
  });

  it('should support updating the configuration for an element instance', () => {
    const validate = (r) => {
      expect(r.body.length).to.be.above(0);
      return r.body.filter(config => config.key === 'event.notification.enabled')[0];
    };

    return cloud.get(`/instances/${sfdcId}/configuration`)
      .then(r => validate(r))
      .then(configuration => cloud.patch(`/instances/${sfdcId}/configuration/${configuration.id}`, Object.assign({}, configuration, { propertyValue: 'true' })))
      .then(r => cloud.get(`/instances/${sfdcId}/configuration/${r.body.id}`))
      .then(r => expect(r.body.propertyValue).to.equal('true'));
  });

  it('should support updating the tags for an element instance', () => {
    const validateTags = (id, tags) => {
      expect(tags.length).to.equal(1) && expect(tags[0]).to.equal('churros-testing');
    };

    let id;
    return provisioner.create('sfdc', { name: 'churros-test' })
      .then(r => id = r.body.id)
      .then(r => cloud.patch(`/instances/${id}`, { id: id, tags: ['churros-testing'] }))
      .then(r => cloud.get(`/instances/${id}`, validateTags(id, r.body.tags)))
      .then(r => provisioner.delete(id));
  });

  it('should support switching an instance to the clone of an element', () => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test element clone as system user. Skipping.');
      return;
    }
    let instance, clone;
    return provisioner.create('shopify')
      .then(r => instance = r.body)
      .then(r => cloud.post('elements/shopify/clone'))
      .then(r => clone = r.body)
      .then(r => cloud.patch(`instances/${instance.id}`, { element: { id: clone.id } })
        .then(r => {
          expect(r.body.element.id).to.equal(clone.id);
        }))
      .then(r => provisioner.delete(instance.id, 'elements/shopify/instances'))
      .then(r => cloud.delete(`elements/${clone.key}`));
  });

  it('should sanitize element instance name on create and update', () => {
    let id;
    return provisioner.create('sfdc', { name: '<a href="#" onClick="javascript:alert(\'xss\');return false;">churros-xss</a>' })
      .then(r => id = r.body.id)
      .then(() => cloud.get(`/instances/${id}`))
      .then(r => expect(r.body.name).to.equal('churros-xss'))
      .then(() => cloud.patch(`/instances/${id}`, { name: '<a href="#" onClick="javascript:alert(\'xss\');return false;">churros-xss-updated</a>' }))
      .then(r => expect(r.body.name).to.equal('churros-xss-updated'))
      .then(() => provisioner.delete(id));
  });

  it('should sanitize element instance tags on create and update', () => {
    let id;
    return provisioner.create('sfdc', { name: '<a href="#" onClick="javascript:alert(\'xss\');return false;">@churros-xss</a>' })
      .then(r => id = r.body.id)
      .then(() => cloud.get(`/instances/${id}`))
      .then(r => expect(r.body.name).to.equal('@churros-xss') && expect(r.body.tags[0]).to.equal('@churros-xss'))
      .then(() => cloud.patch(`/instances/${id}`, { name: '<a href="#" onClick="javascript:alert(\'xss\');return false;">@churros-xss-updated</a>' }))
      .then(r => expect(r.body.name).to.equal('@churros-xss-updated'))
      .then(() => provisioner.delete(id));
  });

  it('should fail with 401 for deleted instance api call', () => {
    let instanceId;
    return provisioner.create('sfdc')
      .then(r => instanceId = r.body.id)
      .then(() => provisioner.delete(instanceId))
      .then(() => cloud.get('hubs/crm/account?pageSize=1', (r) => expect(r).to.have.statusCode(401)));
  });

  it('should ignore any provided hub', () => {
    let withCorrectHub;
    return cloud.get('hubs/crm/account?pageSize=1')
      .then(r => withCorrectHub = r.body)
      .then(() => cloud.get('hubs/documents/account?pageSize=1'))
      .then(r => expect(r.body).to.deep.equal(withCorrectHub))
      .then(() => cloud.get('hubs/crap/account?pageSize=1'))
      .then(r => expect(r.body).to.deep.equal(withCorrectHub))
      .then(() => cloud.get('account?pageSize=1'))
      .then(r => expect(r.body).to.deep.equal(withCorrectHub));
  });

  it('should allow disabling and enabling  an instance', () => {
    return cloud.delete(`instances/${sfdcId}/enabled`)
      .then(() => cloud.get(`/account`, r => expect(r).to.have.statusCode(403)))
      .then(() => cloud.get(`/objects`))
      .then(() =>cloud.put(`instances/${sfdcId}/enabled`))
      .then(() => cloud.get(`/account`))
  });
});
