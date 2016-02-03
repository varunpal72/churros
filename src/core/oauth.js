'use strict';

const webdriver = require('selenium-webdriver');

const manipulateDom = (element, browser, r, username, password, config) => {
  switch (element) {
  case 'desk':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('user_session_email')).sendKeys(username);
    browser.findElement(webdriver.By.id('user_session_password')).sendKeys(password);
    browser.findElement(webdriver.By.id('user_session_submit')).click();
    browser.findElement(webdriver.By.name('commit')).click();
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
  case 'dropbox':
    // TODO - not working yet...
    browser.get(r.body.oauthUrl);
    const findLoginEmail = () => {
      return browser.findElements(webdriver.By.name('login_email'))
        .then(r => {
          r.forEach(element => {
            if (element.getTagName() === 'input') {
              element.sendKeys(username);
              return true;
            }
          });
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
  case 'facebooksocial':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('email')).clear();
    browser.findElement(webdriver.By.id('email')).sendKeys(username);
    browser.findElement(webdriver.By.id('pass')).clear();
    browser.findElement(webdriver.By.id('pass')).sendKeys(password);
    browser.findElement(webdriver.By.id('loginbutton')).click();
    return browser.getCurrentUrl();
  case 'eloqua':
    // TODO - not working yet...
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('login-button')).click();
    browser.findElement(webdriver.By.id('sitename')).sendKeys(config['comany.name']);
    browser.findElement(webdriver.By.id('username')).sendKeys(username);
    browser.findElement(webdriver.By.id('password')).sendKeys(password);
    browser.findElement(webdriver.By.id('submitButton')).click();
    browser.findElement(webdriver.By.id('accept')).click();
    return browser.getCurrentUrl();
  case 'etsy':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username-existing')).sendKeys(username);
    browser.findElement(webdriver.By.id('password-existing')).sendKeys(password);
    browser.findElement(webdriver.By.id('signin_button')).click();
    browser.findElement(webdriver.By.xpath('//*[@id="oauth-submit"]/span/input')).click();
    return browser.getCurrentUrl();
  case 'evernote':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username')).sendKeys(username);
    browser.findElement(webdriver.By.id('password')).sendKeys(password);
    browser.findElement(webdriver.By.id('login')).click();
    try {
      browser.findElement(webdriver.By.name('reauthorize')).click();
    } catch (e) {
      browser.findElement(webdriver.By.name('authorize')).click();
    }
    return browser.getCurrentUrl();
  case 'flickr':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('login-username')).sendKeys(username);
    browser.findElement(webdriver.By.id('login-passwd')).sendKeys(password);
    browser.findElement(webdriver.By.id('login-signin')).click();
    return browser.wait(() => {
      return browser.findElement(webdriver.By.xpath('//*[@id=\'permissions\']/form/div/input[1]'))
        .then(r => r.click())
        .then(r => browser.getCurrentUrl())
        .thenCatch(r => false);
    }, 7000);
  case 'freshbooks':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('user')).sendKeys(username);
    browser.findElement(webdriver.By.id('pass')).sendKeys(password);
    browser.findElement(webdriver.By.name('submit')).click();
    return browser.getCurrentUrl();
  case 'googledrive':
    // TODO - not working yet ...
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('Email')).sendKeys(username);
    browser.findElement(webdriver.By.id('next')).click();
    const passwordCb = () => {
      return browser.findElement(webdriver.By.id('Passwd'))
        .then(r => {
          console.log(r);
          r.sendKeys(password);
          return true;
        });
    };
    return browser.wait(() => {
      return passwordCb()
        .then(r => browser.findElement(webdriver.By.name('signIn')))
        .then(r => r.click())
        .then(r => browser.findElement(webdriver.By.name('submit_approve_access')))
        .then(r => r.click())
        .then(browser.getCurrentUrl())
        .thenCatch(r => false);
    }, 15000);
  case 'hubspot':
  case 'hubspotcrm':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username')).sendKeys(username);
    browser.findElement(webdriver.By.id('password')).sendKeys(password);
    browser.findElement(webdriver.By.id('loginBtn')).click();
    try {
      browser.findElement(webdriver.By.className('accept')).click();
    } catch (e) {}
    return browser.getCurrentUrl();
  case 'instagram':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('id_username')).clear();
    browser.findElement(webdriver.By.id('id_username')).sendKeys(username);
    browser.findElement(webdriver.By.id('id_password')).clear();
    browser.findElement(webdriver.By.id('id_password')).sendKeys(password);
    browser.findElement(webdriver.By.className('button-green')).click();
    // hacky...fragile and i've got a feeling it will break
    return browser.wait(() => {
      return browser.findElement(webdriver.By.name('allow'))
        .then(r => r.click())
        .then(r => browser.getCurrentUrl())
        .thenCatch(r => browser.getCurrentUrl());
    }, 7000);
  case 'infusionsoftcrm':
  case 'infusionsoftmarketing':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username')).sendKeys(username);
    browser.findElement(webdriver.By.id('password')).sendKeys(password);
    browser.findElement(webdriver.By.className('btn-primary')).click();
    browser.findElement(webdriver.By.className('btn-primary')).click();
    return browser.getCurrentUrl();
  case 'mailchimp3':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('username')).sendKeys(username);
    browser.findElement(webdriver.By.id('password')).sendKeys(password);
    browser.findElement(webdriver.By.css('input.button.p0')).click();
    return browser.getCurrentUrl();
  case 'marketo':
    return 'https://foo.bar.com?code=7AB65CDDNC'; // good gracious, why does this work?...
  case 'namely':
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
    browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
    browser.findElement(webdriver.By.className('to-login')).click();
    browser.findElement(webdriver.By.className('button')).click();
    return browser.getCurrentUrl();
  case 'onedrivebusiness':
    // TODO - needs a new OAuth app created with our churros redirect URI (i think)
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('cred_userid_inputtext')).sendKeys(username);
    browser.findElement(webdriver.By.id('cred_password_inputtext')).sendKeys(password);
    browser.findElement(webdriver.By.id('cred_sign_in_button')).click();
    return browser.getCurrentUrl();
  case 'onedrivev2':
    // TODO - needs a new OAuth app created with our churros redirect URI
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('i0116')).sendKeys(username);
    browser.findElement(webdriver.By.id('i0118')).sendKeys(password);
    browser.findElement(webdriver.By.id('idSIButton9')).click();
    try {
      browser.findElement(webdriver.By.id('idBtn_Accept')).click();
    } catch (e) {}
    return browser.getCurrentUrl();
  case 'quickbooks':
    // TODO - not working quite yet...
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.name('Email')).sendKeys(username);
    browser.findElement(webdriver.By.name('Password')).sendKeys(password);
    browser.findElement(webdriver.By.id('ius-sign-in-submit-btn')).click();
    try {
      browser.findElement(webdriver.By.name('companySelectionWidgetCompanySelector_href')).click();
      browser.findElement(webdriver.By.id('authorizeBtn')).click();
    } catch (e) {}
    return browser.getCurrentUrl();
  case 'servicemax':
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
  case 'sharepoint':
    // TODO - needs a new OAuth app setup
    browser.get(r.body.oauthUrl);
    browser.findElement(webdriver.By.id('cred_userid_inputtext')).sendKeys(username);
    browser.findElement(webdriver.By.id('cred_password_inputtext')).sendKeys(username);
    browser.findElement(webdriver.By.id('cred_sign_in_button')).click();
    // browser.findElement(webdriver.By.id('ctl00_PlaceHolderMain_BtnAllow')).click();
    return browser.getCurrentUrl();
  case 'zendesk':
    // TODO - not quite working yet ...
    browser.get(r.body.oauthUrl);
    const iframe = webdriver.By.tagName('iframe')[0];
    browser.switchTo().frame(iframe);
    browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
    browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
    browser.findElement(webdriver.By.name('commit')).click();
    return browser.getCurrentUrl();
  default:
    console.log('No OAuth function found for element %s.  Please implement function in core/oauth so %s can be provisioned', element, element);
    process.exit(1);
  }
};

module.exports = (element, r, username, password, config) => {
  const browser = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
  const url = manipulateDom(element, browser, r, username, password, config);
  browser.close();
  return url;
};
