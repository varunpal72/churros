'use strict';

const util = require('util');
const chakram = require('chakram');
const webdriver = require('selenium-webdriver');
const url = require('url');
const props = require('core/util/properties');

var exports = module.exports = {};

exports.create = () => {
  const apiKey = props.get('box.oauth.api.key');
  const apiSecret = props.get('box.oauth.api.secret');
  const callbackUrl = props.get('box.oauth.callback.url');
  const username = props.get('box.username');
  const password = props.get('box.password');

  const options = {
    qs: {
      apiKey: apiKey,
      apiSecret: apiSecret,
      callbackUrl: callbackUrl
    }
  };

  var driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

  return chakram.get('/elements/box/oauth/url', options)
    .then((r) => {
      driver.get(r.body.oauthUrl);
      driver.findElement(webdriver.By.name('login')).sendKeys(username);
      driver.findElement(webdriver.By.name('password')).sendKeys(password);
      driver.findElement(webdriver.By.name('login_submit')).click();
      driver.findElement(webdriver.By.name('consent_accept')).click();
      return driver.getCurrentUrl();
    })
    .then((r) => {
      const query = url.parse(r, true).query;
      const instance = {
        name: 'churros-box-instance',
        element: {
          key: 'box'
        },
        configuration: {
          'oauth.api.key': apiKey,
          'oauth.api.secret': apiSecret,
          'oauth.callback.url': callbackUrl
        },
        providerData: {
          code: query.code
        }
      };
      return chakram.post('/instances', instance);
    })
    .then((r) => {
      chakram.setRequestDefaults({
        baseUrl: props.get('url') + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s, Element %s', props.get('user.secret'), props.get('org.secret'), r.body.token)
        }
      });
      console.log('Created box element instance with ID: ' + r.body.id);
      driver.close();
      return r;
    })
    .catch((r) => {
      console.log('Failed to create an instance of box: ' + r);
      driver.close();
      process.exit(1);
    });
};
