'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('helpdesk', 'incidents-statuses', (test) => {
  let dateQuery = '2016-04-28T03:49:32Z';
  test
    .withName(`should allow searching by CreationDateTime for ${test.api}`)
    .withOptions({ qs: { where: `CreationDateTime >= '${dateQuery}'` } })
    .withValidation((r) => {
      let date = new Date(dateQuery).getTime();
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.empty;
      const validValues = r.body.filter(obj => obj.CreationDateTime >= date);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  test.should.supportPagination();
});
