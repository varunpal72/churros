'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const campaignsPayload = build({ name: tools.random() });

suite.forElement('marketing', 'campaigns', { payload: campaignsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "subject": tools.random(),
        "from_name": "My Organization",
        "name": tools.random(),
        "from_email": "from-email@example.com",
        "reply_to_email": "replyto-email@example.com",
        "is_permission_reminder_enabled": true,
        "permission_reminder_text": "aaa",
        "is_view_as_webpage_enabled": true,
        "view_as_web_page_text": "View this message as a web page",
        "view_as_web_page_link_text": "Click here",
        "greeting_salutations": "Hello",
        "greeting_name": "FIRST_NAME",
        "greeting_string": "Dear ",
        "email_content": "<html><body><p>This is text of the email message.</p></body></html>",
        "text_content": "This is the text-only content of the email message for mail clients that do not support HTML.",
        "email_content_format": "HTML",
        "style_sheet": "",
        "message_footer": {
          "organization_name": "My Organization",
          "address_line_1": "123 Maple Street",
          "address_line_2": "Suite 1",
          "address_line_3": "",
          "city": "Anytown",
          "state": "MA",
          "international_state": "",
          "postal_code": "01444",
          "country": "US",
          "include_forward_email": true,
          "forward_email_link_text": "Click here to forward this message",
          "include_subscribe_link": true,
          "subscribe_link_text": "Subscribe to Our Newsletter!"
        }
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.withName(`should support searching ${test.api} by campaigns status`)
    .withOptions({ qs: { where: `status ='ALL'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.status = 'ALL');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
