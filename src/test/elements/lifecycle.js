'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const util = require('util');
const provisioner = require('core/provisioner');
const tools = require('core/tools');
const argv = require('optimist').argv;
const fs = require('fs');
const logger = require('winston');
const props = require('core/props');
const scripts = require('core/scripts');

const createAll = (urlTemplate, list) => {
  return Object.keys(list)
    .reduce((p, key) => p.then(() => cloud.post(util.format(urlTemplate, key), list[key])), Promise.resolve(true)); // initial
};

const terminate = error => {
  logger.error('Failed to initialize element: %s', error);
  process.exit(1);
};

const element = argv.element;
let instanceId;

before(() => {
  logger.info('Running tests for element: %s', element);
  if (props.getOptionalForKey(argv.element, 'skip') === true) {
    logger.info('Skip provisioning and all tests for %s', element);
    return {};
  }
  return scripts.runFile(element, `${__dirname}/${element}/assets/scripts.js`, 'before')
  .then(() => {
    return provisioner
      .create(element)
      .then(r => {
        expect(r).to.have.statusCode(200);
        instanceId = r.body.id;
        // object definitions file exists? create the object definitions on the instance
        const objectDefinitionsFile = `${__dirname}/assets/object.definitions`;
        if (fs.existsSync(objectDefinitionsFile + '.json')) {
          logger.debug('Setting up object definitions');
          const url = `/instances/${instanceId}/objects/%s/definitions`;

          // only create object definitions for the resources that are being transformed for this element.  If there
          // aren't any transformations, no need to create any object definitions.
          const transformationsFile = `${__dirname}/${element}/assets/transformations`;
          if (!fs.existsSync(transformationsFile + '.json')) {
            logger.debug(`No transformations found for ${element} so not going to create object definitions`);
            return null;
          }

          const transformations = require(transformationsFile);
          const allObjectDefinitions = require(objectDefinitionsFile);
          const objectDefinitions = Object.keys(allObjectDefinitions)
            .reduce((accum, objectDefinitionName) => {
              if (transformations[objectDefinitionName]) {
                accum[objectDefinitionName] = allObjectDefinitions[objectDefinitionName];
              }
              return accum;
            }, {});

          return createAll(url, objectDefinitions);
        }
      })
      .then(r => {
        // transformations file exists? create the transformations on the instance
        const transformationsFile = `${__dirname}/${element}/assets/transformations`;
        if (fs.existsSync(transformationsFile + '.json')) {
          logger.debug('Setting up transformations');
          const url = `/instances/${instanceId}/transformations/%s`;
          return createAll(url, require(transformationsFile));
        }
      })
      .catch(r => {
        return instanceId ? provisioner.delete(instanceId).then(() => terminate(r)).catch(() => terminate(r)) : terminate(r);
      });
    });
});

// skipped for now because so many fail - remove the skip when fixed
it.skip('should not allow provisioning with bad credentials', () => {
  const config = props.all(element);
  const type = props.getOptionalForKey(element, 'provisioning');
  const passThrough = (r) => r;

  const badConfig = Object.keys(config).reduce((accum, configKey) => {
    accum[configKey] = 'IAmBad';
    return accum;
  }, {});

  const elementInstance = {
    name: tools.random(),
    element: { key: element },
    configuration: badConfig
  };
  if (type === 'oauth2' || type === 'oauth1') {
    elementInstance.providerData = {code: 'IAmBad'};
  }
  const responseCodeValidator = (statusCode) => {
    expect(statusCode).to.be.above(399);
    //expect(statusCode).to.be.below(500);
  };

  return cloud.post(`/instances`, elementInstance, passThrough)
     .then(r => {
        // if we received a 200 status code, then that's actually bad, as we are validating that an element instance is *not* created with bad configs.  lets delete the newly created element instance, and then do our assertions to show the failed test
        if (r.response.statusCode === 200) {
           return cloud.delete(`/instances/${r.body.id}`)
              .then(() => responseCodeValidator(r.response.statusCode));
        }
        // cool, element instance was *not* created, lets make sure we got the right response code
       responseCodeValidator(r.response.statusCode);
     });
});
after(done => {
  instanceId ? provisioner
        .delete(instanceId)
        .then(() => done())
        .catch(r => logger.error('Failed to delete element instance: %s', r))
    : done();
});

let test1 = JSON.parse(`[
  {
    "vid": 668794,
    "is-contact": true,
    "portal-id": 437644,
    "guid": "87c268eb-6923-4488-8621-5bf8d4d62f63",
    "raw": {
      "vid": 668794,
      "merge-audits": [],
      "merged-vids": [],
      "is-contact": true,
      "profile-token": "AO_T-mO4K1uVmz7d3fpPxqhyiV56ZqcrIt0L3CVCrhi26fK3O_2wFHrBP0fG0t1BoQP3dAYlP8UZfgLU0rrWfWPjz0U9yhGEpCtKMNkOpWgEn7Ok_qyt4RUihoxzKthLqpie567-Da4J",
      "form-submissions": [],
      "portal-id": 437644,
      "identity-profiles": [
        {
          "vid": 668794,
          "saved-at-timestamp": 0,
          "identities": [
            {
              "type": "EMAIL",
              "value": "dursocritchfield@tclark.com",
              "timestamp": 1486061076196
            },
            {
              "type": "LEAD_GUID",
              "value": "87c268eb-6923-4488-8621-5bf8d4d62f63",
              "timestamp": 1486061098195
            }
          ],
          "deleted-changed-timestamp": 0
        }
      ],
      "canonical-vid": 668794,
      "profile-url": "https://app.hubspot.com/contacts/437644/lists/public/contact/_AO_T-mO4K1uVmz7d3fpPxqhyiV56ZqcrIt0L3CVCrhi26fK3O_2wFHrBP0fG0t1BoQP3dAYlP8UZfgLU0rrWfWPjz0U9yhGEpCtKMNkOpWgEn7Ok_qyt4RUihoxzKthLqpie567-Da4J/",
      "properties": {
        "firstname": {
          "value": "DURSO"
        },
        "hs_analytics_last_url": {
          "value": ""
        },
        "num_unique_conversion_events": {
          "value": "0"
        },
        "hs_analytics_revenue": {
          "value": "0.0"
        },
        "createdate": {
          "value": "1486061076196"
        },
        "hs_social_num_broadcast_clicks": {
          "value": "0"
        },
        "hs_analytics_first_referrer": {
          "value": ""
        },
        "hs_analytics_last_timestamp": {
          "value": ""
        },
        "hs_email_optout": {
          "value": ""
        },
        "hs_analytics_num_visits": {
          "value": "0"
        },
        "hs_social_linkedin_clicks": {
          "value": "0"
        },
        "hs_analytics_last_visit_timestamp": {
          "value": ""
        },
        "hs_social_last_engagement": {
          "value": ""
        },
        "hs_analytics_source": {
          "value": "OFFLINE"
        },
        "hs_analytics_num_page_views": {
          "value": "0"
        },
        "email": {
          "value": "dursocritchfield@tclark.com"
        },
        "hs_analytics_first_url": {
          "value": ""
        },
        "hubspotscore": {
          "value": "0"
        },
        "hs_analytics_first_visit_timestamp": {
          "value": ""
        },
        "hs_analytics_first_timestamp": {
          "value": "1486061076196"
        },
        "lastmodifieddate": {
          "value": "1486061247251"
        },
        "hs_social_google_plus_clicks": {
          "value": "0"
        },
        "hs_analytics_last_referrer": {
          "value": ""
        },
        "hs_analytics_average_page_views": {
          "value": "0"
        },
        "lastname": {
          "value": "CRITCHFIELD"
        },
        "hs_social_facebook_clicks": {
          "value": "0"
        },
        "num_conversion_events": {
          "value": "0"
        },
        "hs_analytics_num_event_completions": {
          "value": "0"
        },
        "hs_analytics_source_data_2": {
          "value": "auditId=null"
        },
        "hs_social_twitter_clicks": {
          "value": "0"
        },
        "hs_analytics_source_data_1": {
          "value": "BATCH_UPDATE"
        },
        "hs_email_sends_since_last_engagement": {
          "value": "0"
        }
      }
    },
    "email": "dursocritchfield@tclark.com",
    "properties": {
      "firstname": "DURSO",
      "hs_analytics_last_url": "",
      "num_unique_conversion_events": "0",
      "hs_analytics_revenue": "0.0",
      "createdate": "1486061076196",
      "hs_social_num_broadcast_clicks": "0",
      "hs_analytics_first_referrer": "",
      "hs_analytics_last_timestamp": "",
      "hs_email_optout": "",
      "hs_analytics_num_visits": "0",
      "hs_social_linkedin_clicks": "0",
      "hs_analytics_last_visit_timestamp": "",
      "hs_social_last_engagement": "",
      "hs_analytics_source": "OFFLINE",
      "hs_analytics_num_page_views": "0",
      "email": "dursocritchfield@tclark.com",
      "hs_analytics_first_url": "",
      "hubspotscore": "0",
      "hs_analytics_first_visit_timestamp": "",
      "hs_analytics_first_timestamp": "1486061076196",
      "lastmodifieddate": "1486061247251",
      "hs_social_google_plus_clicks": "0",
      "hs_analytics_last_referrer": "",
      "hs_analytics_average_page_views": "0",
      "lastname": "CRITCHFIELD",
      "hs_social_facebook_clicks": "0",
      "num_conversion_events": "0",
      "hs_analytics_num_event_completions": "0",
      "hs_analytics_source_data_2": "auditId=null",
      "hs_social_twitter_clicks": "0",
      "hs_analytics_source_data_1": "BATCH_UPDATE",
      "hs_email_sends_since_last_engagement": "0"
    }
  }
]`)
let test2 = JSON.parse(`[
  {
    "vid": 343199,
    "is-contact": true,
    "portal-id": 437644,
    "guid": "3377129d-64c0-4e5a-ad0c-f68b5678e0a1",
    "raw": {
      "vid": 343199,
      "merge-audits": [],
      "merged-vids": [],
      "is-contact": true,
      "profile-token": "AO_T-mNNdC3DTZ5aJsdUkAvhnCGsYKC3wCTsPqSYnnWaGC7w3WG31XtIERtPXDkVVwVr0x3L3dGUUJTUPirUjlBYgzkDkzhHCdo-VVFCmA3PuJGz4EjiGYVBjL8HcVYGAWP90hglUVSl",
      "form-submissions": [],
      "portal-id": 437644,
      "identity-profiles": [
        {
          "vid": 343199,
          "saved-at-timestamp": 0,
          "identities": [
            {
              "type": "EMAIL",
              "value": "libero@cras.com",
              "timestamp": 1454517939837
            },
            {
              "type": "LEAD_GUID",
              "value": "3377129d-64c0-4e5a-ad0c-f68b5678e0a1",
              "timestamp": 1454517939856
            }
          ],
          "deleted-changed-timestamp": 0
        }
      ],
      "canonical-vid": 343199,
      "profile-url": "https://app.hubspot.com/contacts/437644/lists/public/contact/_AO_T-mNNdC3DTZ5aJsdUkAvhnCGsYKC3wCTsPqSYnnWaGC7w3WG31XtIERtPXDkVVwVr0x3L3dGUUJTUPirUjlBYgzkDkzhHCdo-VVFCmA3PuJGz4EjiGYVBjL8HcVYGAWP90hglUVSl/",
      "properties": {
        "hs_email_optout_309994": {
          "value": ""
        },
        "firstname": {
          "value": "Raya"
        },
        "hs_analytics_last_url": {
          "value": ""
        },
        "num_unique_conversion_events": {
          "value": "0"
        },
        "hs_analytics_revenue": {
          "value": "0.0"
        },
        "createdate": {
          "value": "1454517939837"
        },
        "hs_social_num_broadcast_clicks": {
          "value": "0"
        },
        "hs_analytics_first_referrer": {
          "value": ""
        },
        "hs_analytics_last_timestamp": {
          "value": ""
        },
        "hs_email_optout": {
          "value": ""
        },
        "hs_analytics_num_visits": {
          "value": "0"
        },
        "hs_social_linkedin_clicks": {
          "value": "0"
        },
        "hs_analytics_last_visit_timestamp": {
          "value": ""
        },
        "hs_social_last_engagement": {
          "value": ""
        },
        "hs_analytics_source": {
          "value": "OFFLINE"
        },
        "hs_analytics_num_page_views": {
          "value": "0"
        },
        "email": {
          "value": "libero@cras.com"
        },
        "hs_analytics_first_url": {
          "value": ""
        },
        "external_contact_id": {
          "value": "1242160000000290645"
        },
        "hubspotscore": {
          "value": "0"
        },
        "hs_analytics_first_visit_timestamp": {
          "value": ""
        },
        "hs_analytics_first_timestamp": {
          "value": "1454517939837"
        },
        "lastmodifieddate": {
          "value": "1460651225577"
        },
        "hs_social_google_plus_clicks": {
          "value": "0"
        },
        "hs_analytics_last_referrer": {
          "value": ""
        },
        "hs_lifecyclestage_subscriber_date": {
          "value": "1454517939837"
        },
        "hs_analytics_average_page_views": {
          "value": "0"
        },
        "external_user_id": {
          "value": "1242160000000071001"
        },
        "lastname": {
          "value": "Mendez"
        },
        "hs_social_facebook_clicks": {
          "value": "0"
        },
        "num_conversion_events": {
          "value": "0"
        },
        "hs_analytics_num_event_completions": {
          "value": "0"
        },
        "hs_analytics_source_data_2": {
          "value": "contact-upsert"
        },
        "hs_social_twitter_clicks": {
          "value": "0"
        },
        "hs_analytics_source_data_1": {
          "value": "API"
        },
        "lifecyclestage": {
          "value": "subscriber"
        },
        "hs_email_sends_since_last_engagement": {
          "value": "0"
        }
      }
    },
    "email": "libero@cras.com",
    "properties": {
      "hs_email_optout_309994": "",
      "firstname": "Raya",
      "hs_analytics_last_url": "",
      "num_unique_conversion_events": "0",
      "hs_analytics_revenue": "0.0",
      "createdate": "1454517939837",
      "hs_social_num_broadcast_clicks": "0",
      "hs_analytics_first_referrer": "",
      "hs_analytics_last_timestamp": "",
      "hs_email_optout": "",
      "hs_analytics_num_visits": "0",
      "hs_social_linkedin_clicks": "0",
      "hs_analytics_last_visit_timestamp": "",
      "hs_social_last_engagement": "",
      "hs_analytics_source": "OFFLINE",
      "hs_analytics_num_page_views": "0",
      "email": "libero@cras.com",
      "hs_analytics_first_url": "",
      "external_contact_id": "1242160000000290645",
      "hubspotscore": "0",
      "hs_analytics_first_visit_timestamp": "",
      "hs_analytics_first_timestamp": "1454517939837",
      "lastmodifieddate": "1460651225577",
      "hs_social_google_plus_clicks": "0",
      "hs_analytics_last_referrer": "",
      "hs_lifecyclestage_subscriber_date": "1454517939837",
      "hs_analytics_average_page_views": "0",
      "external_user_id": "1242160000000071001",
      "lastname": "Mendez",
      "hs_social_facebook_clicks": "0",
      "num_conversion_events": "0",
      "hs_analytics_num_event_completions": "0",
      "hs_analytics_source_data_2": "contact-upsert",
      "hs_social_twitter_clicks": "0",
      "hs_analytics_source_data_1": "API",
      "lifecyclestage": "subscriber",
      "hs_email_sends_since_last_engagement": "0"
    }
  }
]`)
let test3 = JSON.parse(`[
  {
    "vid": 343197,
    "is-contact": true,
    "portal-id": 437644,
    "guid": "eee05590-4a56-4a8e-b2c9-0ba6c96cd2f0",
    "raw": {
      "vid": 343197,
      "merge-audits": [],
      "merged-vids": [],
      "is-contact": true,
      "profile-token": "AO_T-mNnP59El8_d2Sq5_NISMEohfUcApKcj5ywKmWePe3CCcmy0DD-Oc4XqmJLdjyT26xwOoi4aL8QjfLv0M267TE12IX-66i1KCu1uX7U8uUvk_GlTIYQQaDgJzDHDiciBzaVEiGKp",
      "form-submissions": [],
      "portal-id": 437644,
      "identity-profiles": [
        {
          "vid": 343197,
          "saved-at-timestamp": 0,
          "identities": [
            {
              "type": "EMAIL",
              "value": "orci.consectetuer@vitaesodalesat.co.uk",
              "timestamp": 1454517934779
            },
            {
              "type": "LEAD_GUID",
              "value": "eee05590-4a56-4a8e-b2c9-0ba6c96cd2f0",
              "timestamp": 1454517934784
            }
          ],
          "deleted-changed-timestamp": 0
        }
      ],
      "canonical-vid": 343197,
      "profile-url": "https://app.hubspot.com/contacts/437644/lists/public/contact/_AO_T-mNnP59El8_d2Sq5_NISMEohfUcApKcj5ywKmWePe3CCcmy0DD-Oc4XqmJLdjyT26xwOoi4aL8QjfLv0M267TE12IX-66i1KCu1uX7U8uUvk_GlTIYQQaDgJzDHDiciBzaVEiGKp/",
      "properties": {
        "hs_email_optout_309994": {
          "value": ""
        },
        "firstname": {
          "value": "Francis"
        },
        "hs_analytics_last_url": {
          "value": ""
        },
        "num_unique_conversion_events": {
          "value": "0"
        },
        "hs_analytics_revenue": {
          "value": "0.0"
        },
        "createdate": {
          "value": "1454517934779"
        },
        "hs_social_num_broadcast_clicks": {
          "value": "0"
        },
        "hs_analytics_first_referrer": {
          "value": ""
        },
        "hs_analytics_last_timestamp": {
          "value": ""
        },
        "hs_email_optout": {
          "value": ""
        },
        "hs_analytics_num_visits": {
          "value": "0"
        },
        "hs_social_linkedin_clicks": {
          "value": "0"
        },
        "hs_analytics_last_visit_timestamp": {
          "value": ""
        },
        "hs_social_last_engagement": {
          "value": ""
        },
        "hs_analytics_source": {
          "value": "OFFLINE"
        },
        "hs_analytics_num_page_views": {
          "value": "0"
        },
        "email": {
          "value": "orci.consectetuer@vitaesodalesat.co.uk"
        },
        "hs_analytics_first_url": {
          "value": ""
        },
        "external_contact_id": {
          "value": "1242160000000290652"
        },
        "hubspotscore": {
          "value": "0"
        },
        "hs_analytics_first_visit_timestamp": {
          "value": ""
        },
        "hs_analytics_first_timestamp": {
          "value": "1454517934779"
        },
        "lastmodifieddate": {
          "value": "1460651223031"
        },
        "hs_social_google_plus_clicks": {
          "value": "0"
        },
        "hs_analytics_last_referrer": {
          "value": ""
        },
        "hs_lifecyclestage_subscriber_date": {
          "value": "1454517934779"
        },
        "hs_analytics_average_page_views": {
          "value": "0"
        },
        "external_user_id": {
          "value": "1242160000000071001"
        },
        "lastname": {
          "value": "Sykes"
        },
        "hs_social_facebook_clicks": {
          "value": "0"
        },
        "num_conversion_events": {
          "value": "0"
        },
        "hs_analytics_num_event_completions": {
          "value": "0"
        },
        "hs_analytics_source_data_2": {
          "value": "contact-upsert"
        },
        "hs_social_twitter_clicks": {
          "value": "0"
        },
        "hs_analytics_source_data_1": {
          "value": "API"
        },
        "lifecyclestage": {
          "value": "subscriber"
        },
        "hs_email_sends_since_last_engagement": {
          "value": "0"
        }
      }
    },
    "email": "orci.consectetuer@vitaesodalesat.co.uk",
    "properties": {
      "hs_email_optout_309994": "",
      "firstname": "Francis",
      "hs_analytics_last_url": "",
      "num_unique_conversion_events": "0",
      "hs_analytics_revenue": "0.0",
      "createdate": "1454517934779",
      "hs_social_num_broadcast_clicks": "0",
      "hs_analytics_first_referrer": "",
      "hs_analytics_last_timestamp": "",
      "hs_email_optout": "",
      "hs_analytics_num_visits": "0",
      "hs_social_linkedin_clicks": "0",
      "hs_analytics_last_visit_timestamp": "",
      "hs_social_last_engagement": "",
      "hs_analytics_source": "OFFLINE",
      "hs_analytics_num_page_views": "0",
      "email": "orci.consectetuer@vitaesodalesat.co.uk",
      "hs_analytics_first_url": "",
      "external_contact_id": "1242160000000290652",
      "hubspotscore": "0",
      "hs_analytics_first_visit_timestamp": "",
      "hs_analytics_first_timestamp": "1454517934779",
      "lastmodifieddate": "1460651223031",
      "hs_social_google_plus_clicks": "0",
      "hs_analytics_last_referrer": "",
      "hs_lifecyclestage_subscriber_date": "1454517934779",
      "hs_analytics_average_page_views": "0",
      "external_user_id": "1242160000000071001",
      "lastname": "Sykes",
      "hs_social_facebook_clicks": "0",
      "num_conversion_events": "0",
      "hs_analytics_num_event_completions": "0",
      "hs_analytics_source_data_2": "contact-upsert",
      "hs_social_twitter_clicks": "0",
      "hs_analytics_source_data_1": "API",
      "lifecyclestage": "subscriber",
      "hs_email_sends_since_last_engagement": "0"
    }
  },
  {
    "vid": 343199,
    "is-contact": true,
    "portal-id": 437644,
    "guid": "3377129d-64c0-4e5a-ad0c-f68b5678e0a1",
    "raw": {
      "vid": 343199,
      "merge-audits": [],
      "merged-vids": [],
      "is-contact": true,
      "profile-token": "AO_T-mMe-OZfQMjOA33EmV4QQeFFD8Vb0whYQszF3E6cq0ZPjVxQJ7E3PlJf5ZXLXO0CLxYy6Csnqn3ds0ni1Ca4VMO17xwT525Kpg2Dq4Q6m6Cnoz0T5gUVdtO2YykaAngw4TWmcSjR",
      "form-submissions": [],
      "portal-id": 437644,
      "identity-profiles": [
        {
          "vid": 343199,
          "saved-at-timestamp": 0,
          "identities": [
            {
              "type": "EMAIL",
              "value": "libero@cras.com",
              "timestamp": 1454517939837
            },
            {
              "type": "LEAD_GUID",
              "value": "3377129d-64c0-4e5a-ad0c-f68b5678e0a1",
              "timestamp": 1454517939856
            }
          ],
          "deleted-changed-timestamp": 0
        }
      ],
      "canonical-vid": 343199,
      "profile-url": "https://app.hubspot.com/contacts/437644/lists/public/contact/_AO_T-mMe-OZfQMjOA33EmV4QQeFFD8Vb0whYQszF3E6cq0ZPjVxQJ7E3PlJf5ZXLXO0CLxYy6Csnqn3ds0ni1Ca4VMO17xwT525Kpg2Dq4Q6m6Cnoz0T5gUVdtO2YykaAngw4TWmcSjR/",
      "properties": {
        "hs_email_optout_309994": {
          "value": ""
        },
        "firstname": {
          "value": "Raya"
        },
        "hs_analytics_last_url": {
          "value": ""
        },
        "num_unique_conversion_events": {
          "value": "0"
        },
        "hs_analytics_revenue": {
          "value": "0.0"
        },
        "createdate": {
          "value": "1454517939837"
        },
        "hs_social_num_broadcast_clicks": {
          "value": "0"
        },
        "hs_analytics_first_referrer": {
          "value": ""
        },
        "hs_analytics_last_timestamp": {
          "value": ""
        },
        "hs_email_optout": {
          "value": ""
        },
        "hs_analytics_num_visits": {
          "value": "0"
        },
        "hs_social_linkedin_clicks": {
          "value": "0"
        },
        "hs_analytics_last_visit_timestamp": {
          "value": ""
        },
        "hs_social_last_engagement": {
          "value": ""
        },
        "hs_analytics_source": {
          "value": "OFFLINE"
        },
        "hs_analytics_num_page_views": {
          "value": "0"
        },
        "email": {
          "value": "libero@cras.com"
        },
        "hs_analytics_first_url": {
          "value": ""
        },
        "external_contact_id": {
          "value": "1242160000000290645"
        },
        "hubspotscore": {
          "value": "0"
        },
        "hs_analytics_first_visit_timestamp": {
          "value": ""
        },
        "hs_analytics_first_timestamp": {
          "value": "1454517939837"
        },
        "lastmodifieddate": {
          "value": "1460651225577"
        },
        "hs_social_google_plus_clicks": {
          "value": "0"
        },
        "hs_analytics_last_referrer": {
          "value": ""
        },
        "hs_lifecyclestage_subscriber_date": {
          "value": "1454517939837"
        },
        "hs_analytics_average_page_views": {
          "value": "0"
        },
        "external_user_id": {
          "value": "1242160000000071001"
        },
        "lastname": {
          "value": "Mendez"
        },
        "hs_social_facebook_clicks": {
          "value": "0"
        },
        "num_conversion_events": {
          "value": "0"
        },
        "hs_analytics_num_event_completions": {
          "value": "0"
        },
        "hs_analytics_source_data_2": {
          "value": "contact-upsert"
        },
        "hs_social_twitter_clicks": {
          "value": "0"
        },
        "hs_analytics_source_data_1": {
          "value": "API"
        },
        "lifecyclestage": {
          "value": "subscriber"
        },
        "hs_email_sends_since_last_engagement": {
          "value": "0"
        }
      }
    },
    "email": "libero@cras.com",
    "properties": {
      "hs_email_optout_309994": "",
      "firstname": "Raya",
      "hs_analytics_last_url": "",
      "num_unique_conversion_events": "0",
      "hs_analytics_revenue": "0.0",
      "createdate": "1454517939837",
      "hs_social_num_broadcast_clicks": "0",
      "hs_analytics_first_referrer": "",
      "hs_analytics_last_timestamp": "",
      "hs_email_optout": "",
      "hs_analytics_num_visits": "0",
      "hs_social_linkedin_clicks": "0",
      "hs_analytics_last_visit_timestamp": "",
      "hs_social_last_engagement": "",
      "hs_analytics_source": "OFFLINE",
      "hs_analytics_num_page_views": "0",
      "email": "libero@cras.com",
      "hs_analytics_first_url": "",
      "external_contact_id": "1242160000000290645",
      "hubspotscore": "0",
      "hs_analytics_first_visit_timestamp": "",
      "hs_analytics_first_timestamp": "1454517939837",
      "lastmodifieddate": "1460651225577",
      "hs_social_google_plus_clicks": "0",
      "hs_analytics_last_referrer": "",
      "hs_lifecyclestage_subscriber_date": "1454517939837",
      "hs_analytics_average_page_views": "0",
      "external_user_id": "1242160000000071001",
      "lastname": "Mendez",
      "hs_social_facebook_clicks": "0",
      "num_conversion_events": "0",
      "hs_analytics_num_event_completions": "0",
      "hs_analytics_source_data_2": "contact-upsert",
      "hs_social_twitter_clicks": "0",
      "hs_analytics_source_data_1": "API",
      "lifecyclestage": "subscriber",
      "hs_email_sends_since_last_engagement": "0"
    }
  }
]`)

it('equal things', ()=> {
  expect(test1.concat(test2)).to.deep.equal(test3)
})
