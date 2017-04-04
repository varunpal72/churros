'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('crm', 'objects', (test) => {
    const validateAccountType = (fields) => {
        let isPicklist = false;
        fields.forEach(field => isPicklist = (field.vendorPath === 'accountType' && field.vendorNativeType === 'picklist' && expect(field).to.contain.key('picklistValues')));
        return isPicklist;
    };

    it('should include picklist for account metadata', () => {
        return cloud.get(test.api + '/Account/metadata')
            .then(r => validateAccountType(r.body.fields));
    });
});
