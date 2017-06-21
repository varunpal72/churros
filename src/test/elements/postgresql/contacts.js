'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('db', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();


  const metaData = { "primaryKeyName": "contact_id", "bulkUploadRecordSize": 20 };
  const opts = { formData: { metaData: JSON.stringify(metaData) } };
  test.should.supportBulkUpload(opts, `${__dirname}/assets/contacts.create.csv`, 'contacts', `last_name='Test2105'`);

  const metaData2 = { "action": "upsert", "primaryKeyName": "contact_id", "bulkUploadRecordSize": 20 };
  const opts2 = { formData: { metaData: JSON.stringify(metaData2) } };
  test.should.supportBulkUpload(opts2, `${__dirname}/assets/contacts.csv`, 'contacts', `last_name='Test2005'`);

  const metaData3 = { "action": "upsert", "primaryKeyName": "contact_id" };
  const opts3 = { formData: { metaData: JSON.stringify(metaData3) } };
  test.should.supportBulkUpload(opts3, `${__dirname}/assets/contacts.csv`, 'contacts', `last_name='Test2005'`);
});
