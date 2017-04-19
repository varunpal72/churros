'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const uri = '/hubs/crm/objects/contact/metadata';

suite.forElement('crm', 'metadata', (test) => {
  it('should test objects api', () => {
    return cloud.get('/hubs/crm/objects')
      .then(r => expect(r.body).to.include('Account'));
  });

  it('should include filterable, createable, and updateable for metadata', () => {
    return cloud.get(uri)
      .then(r => {
        let metadata = r.body.fields[0];
        expect(metadata.filterable).to.exist;
        expect(metadata.createable).to.exist;
        expect(metadata.updateable).to.exist;
      });
  });

  it('should include picklist for contact metadata', () => {
    const validateSalutation = (fields) => {
      let isPicklist = false;
      fields.forEach(field => isPicklist = (field.vendorPath === 'Salutation' && field.vendorNativeType === 'picklist' && expect(field).to.contain.key('picklistValues')));
      return isPicklist;
    };

    return cloud.get(uri)
      .then(r => validateSalutation(r.body.fields));
  });
});
