'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload =  {
    "name": tools.randomStr('abcdefghijklmnopqrstuvwxyz11234567890', 10),
    "htmlContent": {
        "type": "RawHtmlContent",
        "html": "<html><body><div>Here is some sample text for Churros.</div></body></html>",
        "metaTags": []
    }
};


suite.forElement('marketing', 'landing-pages', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('name');
});
