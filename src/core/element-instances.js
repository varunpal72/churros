'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const auth = require('core/auth');
const webdriver = require('selenium-webdriver');
const props = require('core/properties');
const url = require('url');

const elements = {
  box: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.name('login')).sendKeys(username);
    driver.findElement(webdriver.By.name('password')).sendKeys(password);
    driver.findElement(webdriver.By.name('login_submit')).click();
    driver.findElement(webdriver.By.name('consent_accept')).click();
    return driver.getCurrentUrl();
  }
};

var exports = module.exports = {};

exports.all = () => {
  const url = '/instances';
  return chakram.get(url)
    .then(r => {
      expect(r).to.have.status(200);
      return r.body;
    })
    .catch(r => {
      console.log('Failed to retrieve element instances: ' + r);
    });
};

exports.create = (element, args) => {
  const apiKey = props.get(util.format('%s.oauth.api.key', element));
  const apiSecret = props.get(util.format('%s.oauth.api.secret', element));
  const callbackUrl = props.get(util.format('%s.oauth.callback.url', element));
  const username = props.get(util.format('%s.username', element));
  const password = props.get(util.format('%s.password', element));
  const callback = elements[element];

  const options = {
    qs: {
      apiKey: apiKey,
      apiSecret: apiSecret,
      callbackUrl: callbackUrl
    }
  };
  const driver = new webdriver.Builder().forBrowser('phantomjs').build();
  const oauthUrl = util.format('/elements/%s/oauth/url', element);

  return chakram.get(oauthUrl, options)
    .then(r => {
      return callback(r, username, password, driver);
    })
    .then(r => {
      const query = url.parse(r, true).query;
      const instance = {
        name: 'churros-instance',
        element: {
          key: element
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
    .then(r => {
      console.log('Created %s element instance with ID: %s', element, r.body.id);
      auth.setup(r.body.token);
      driver.close();
      return r;
    })
    .catch(r => {
      console.log('Failed to create an instance of %s: %s', element, r);
      driver.close();
      process.exit(1);
    });
};

exports.delete = (id) => {
  const url = '/instances/' + id;
  return chakram.delete(url)
    .then(r => {
      expect(r).to.have.status(200);
      console.log('Deleted element instance with ID: ' + id);
      auth.setup();
      return r.body;
    })
    .catch(r => {
      console.log('Failed to delete element instance: ' + r);
    });
};
