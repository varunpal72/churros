'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const webdriver = require('selenium-webdriver');
const props = require('core/props');
const url = require('url');

const sfdcs = (r, username, password, driver) => {
  driver.get(r.body.oauthUrl);
  driver.findElement(webdriver.By.id("username")).clear();
  driver.findElement(webdriver.By.id("username")).sendKeys(username);
  driver.findElement(webdriver.By.id("password")).clear();
  driver.findElement(webdriver.By.id("password")).sendKeys(password);
  driver.findElement(webdriver.By.id("Login")).click();
  driver.get(driver.getCurrentUrl()); // have to actually go to it and then it redirects you to your callback
  return driver.getCurrentUrl();
};

const elements = {
  sfdc: (r, username, password, driver) => sfdcs(r, username, password, driver),
  sfdcservicecloud: (r, username, password, driver) => sfdcs(r, username, password, driver),
  sfdcmarketingcloud: (r, username, password, driver) => sfdcs(r, username, password, driver),
  sfdcdocuments: (r, username, password, driver) => sfdcs(r, username, password, driver),
  box: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.name('login')).sendKeys(username);
    driver.findElement(webdriver.By.name('password')).sendKeys(password);
    driver.findElement(webdriver.By.name('login_submit')).click();
    driver.findElement(webdriver.By.name('consent_accept')).click();
    return driver.getCurrentUrl();
  },
  facebooksocial: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id('email')).clear();
    driver.findElement(webdriver.By.id('email')).sendKeys(username);
    driver.findElement(webdriver.By.id('pass')).clear();
    driver.findElement(webdriver.By.id('pass')).sendKeys(password);
    driver.findElement(webdriver.By.id('loginbutton')).click();
    return driver.getCurrentUrl();
  },
  instagram: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.id("id_username")).clear();
    driver.findElement(webdriver.By.id("id_username")).sendKeys(username);
    driver.findElement(webdriver.By.id("id_password")).clear();
    driver.findElement(webdriver.By.id("id_password")).sendKeys(password);
    driver.findElement(webdriver.By.className("button-green")).click();
    return driver.getCurrentUrl();
  },
  zendesk: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    // TODO
    return driver.getCurrentUrl();
  },
  dropbox: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    // TODO
    return driver.getCurrentUrl();
  },
  shopify: (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    // TODO
    return driver.getCurrentUrl();
  }
};

var exports = module.exports = {};

const genConfig = (props, args) => {
  const config = props;
  if (args) Object.keys(args).forEach(k => config[k] = args[k]);
  return config;
};

const createOAuthElement = (element, args, cb) => {
  const callbackUrl = props.get('oauth.callback.url');

  const apiKey = props.getForKey(element, 'oauth.api.key');
  const apiSecret = props.getForKey(element, 'oauth.api.secret');
  const username = props.getForKey(element, 'username');
  const password = props.getForKey(element, 'password');

  const options = {
    qs: {
      apiKey: apiKey,
      apiSecret: apiSecret,
      callbackUrl: callbackUrl
    }
  };
  const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();
  const oauthUrl = util.format('/elements/%s/oauth/url', element);

  return chakram.get(oauthUrl, options)
    .then(r => cb(r, username, password, driver))
    .then(r => {
      const query = url.parse(r, true).query;
      const config = genConfig({
        'oauth.api.key': apiKey,
        'oauth.api.secret': apiSecret,
        'oauth.callback.url': callbackUrl
      }, args);

      const instance = {
        name: 'churros-instance',
        element: {
          key: element
        },
        configuration: config,
        providerData: {
          code: query.code
        }
      };
      return chakram.post('/instances', instance);
    })
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Created %s element instance with ID: %s', element, r.body.id);
      chocolate.authReset(r.body.token);
      driver.close();
      return r;
    })
    .catch(r => {
      console.log('Failed to create an instance of %s: %s', element, r);
      driver.close();
      process.exit(1);
    });
};

const createElement = (element, args) => {
  const instance = {
    name: 'churros-instance',
    element: {
      key: element
    },
    configuration: genConfig(props.all(element), args)
  };

  return chakram.post('/instances', instance)
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Created %s element instance with ID: %s', element, r.body.id);
      chocolate.authReset(r.body.token);
      return r;
    })
    .catch(r => {
      console.log('Failed to create an instance of %s: %s', element, r);
      process.exit(1);
    });
};

exports.create = (element, args) => {
  console.log('Attempting to provision %s', element);

  const cb = elements[element];
  return cb ?
    createOAuthElement(element, args, cb) :
    createElement(element, args);
};

exports.delete = (id) => {
  const url = '/instances/' + id;
  return chakram.delete(url)
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Deleted element instance with ID: ' + id);
      chocolate.authReset();
      return r.body;
    })
    .catch(r => {
      console.log('Failed to delete element instance: ' + r);
    });
};
