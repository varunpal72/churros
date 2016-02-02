'use strict';

const webdriver = require('selenium-webdriver');

const manipulateDom = (element, browser, r, username, password) => {
  switch (element) {
  case 'desk':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('user_session_email')).sendKeys(username);
    browser.findElement(webdriver.By.id('user_session_password')).sendKeys(password);
    browser.findElement(webdriver.By.id('user_session_submit')).click();
    browser.findElement(webdriver.By.name('commit')).click();
    return browser.getCurrentUrl();
  case 'dropbox':
    browser.get(r.body.oauthUrl);
    const findLoginEmail = () => {
      return browser.findElements(webdriver.By.name('login_email'))
        .then(r => {
          r.forEach(element => {
            if (element.getTagName() === 'input') {
              element.sendKeys(username);
              return true;
            }
          })
        });
    };
    const findLoginPassword = () => {
      return browser.findElements(webdriver.By.name('login_password'))
        .then(r => {
          r.forEach(element => {
            if (element.getTagName() === 'input') {
              r.sendKeys(password);
              return true;
            }
          });
        });
    };
    const findBtn = () => {
      return browser.findElement(webdriver.By.css('.login-button'))
        .then(r => {
          console.log('clicking on %s', r);
          r.click();
          return true;
        });
    };
    return browser.wait(() => {
      return findLoginEmail()
        .then(findLoginPassword())
        .then(findBtn())
        .thenCatch(() => false);
    }, 5000);
  case 'sfdc':
  case 'sfdcservicecloud':
  case 'sfdcmarketingcloud':
  case 'sfdcdocuments':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id("username")).clear();
    browser.findElement(webdriver.By.id("username")).sendKeys(username);
    browser.findElement(webdriver.By.id("password")).clear();
    browser.findElement(webdriver.By.id("password")).sendKeys(password);
    browser.findElement(webdriver.By.id("Login")).click();
    browser.get(browser.getCurrentUrl()); // have to actually go to it and then it redirects you to your callback
    return browser.getCurrentUrl();
  case 'etsy':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username-existing')).sendKeys(username);
    browser.findElement(webdriver.By.id('password-existing')).sendKeys(password);
    browser.findElement(webdriver.By.id('signin_button')).click();
    browser.findElement(webdriver.By.xpath('//*[@id="oauth-submit"]/span/input')).click();
    return browser.getCurrentUrl();
  case 'acton':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('authorizeLink')).click();
    browser.findElement(webdriver.By.id('oauth_user_name')).sendKeys(username);
    browser.findElement(webdriver.By.id('oauth_user_password')).sendKeys(password);
    browser.findElement(webdriver.By.id('loginBtn')).click();
    return browser.getCurrentUrl();
  case 'box':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.name('login')).sendKeys(username);
    browser.findElement(webdriver.By.name('password')).sendKeys(password);
    browser.findElement(webdriver.By.name('login_submit')).click();
    browser.findElement(webdriver.By.name('consent_accept')).click();
    return browser.getCurrentUrl();
  case 'facebooksocial':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('email')).clear();
    browser.findElement(webdriver.By.id('email')).sendKeys(username);
    browser.findElement(webdriver.By.id('pass')).clear();
    browser.findElement(webdriver.By.id('pass')).sendKeys(password);
    browser.findElement(webdriver.By.id('loginbutton')).click();
    return browser.getCurrentUrl();
  case 'instagram':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('id_username')).clear();
    browser.findElement(webdriver.By.id('id_username')).sendKeys(username);
    browser.findElement(webdriver.By.id('id_password')).clear();
    browser.findElement(webdriver.By.id('id_password')).sendKeys(password);
    browser.findElement(webdriver.By.className('button-green')).click();
    return browser.getCurrentUrl();
  case 'zendesk':
    browser.get(r.body.oauthUrl);
    const iframe = webdriver.By.tagName('iframe')[0];
    browser.switchTo().frame(iframe);
    browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
    browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
    return browser.getCurrentUrl();
  default:
    console.log('No OAuth callback found for element %s.  Please implement that callback in core/oauth so %s can be provisioned', element, element);
    process.exit(1);
  }
};

module.exports = (element, r, username, password) => {
  const browser = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
  const url = manipulateDom(element, browser, r, username, password);
  browser.close();
  return url;
};
