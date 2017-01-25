/** @module core/oauth */
'use strict';

const webdriver = require('selenium-webdriver');
const logger = require('winston');
const props = require('core/props');

/* jshint unused:false */
const wait = (browser, ms) => browser.wait(() => false, ms);

const manipulateDom = (element, browser, r, username, password, config) => {
  switch (element) {
    case 'adobe-esign':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.name('j_username')).sendKeys(username);
      browser.findElement(webdriver.By.name('j_password')).sendKeys(password);
      browser.findElement(webdriver.By.id('login')).click();
      browser.wait(() => {
        return browser.getTitle().then((title) => !title);
      }, 10000);
      return browser.getCurrentUrl();
    case 'base':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
      browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
      browser.findElement(webdriver.By.className('icon-lock')).click();
      browser.wait(() => {
        return browser.isElementPresent(webdriver.By.className('btn')); //slow load time for accept screen
      }, 5000);
      browser.findElement(webdriver.By.className('btn')).click();
      return browser.getCurrentUrl();
    case 'ciscospark':
      browser.get(r.body.oauthUrl);
      browser.isElementPresent(webdriver.By.id('IDToken1'));
      browser.findElement(webdriver.By.id('IDToken1')).sendKeys(username);
      browser.findElement(webdriver.By.id('IDButton2')).click();
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('IDToken2')), 3000);
      browser.findElement(webdriver.By.id('IDToken2')).sendKeys(password);
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('Button1')), 3000);
      browser.findElement(webdriver.By.id('Button1')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.name('accept')), 6000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.name('accept'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
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
    case 'actessentialsoauth':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('Username')).sendKeys(username);
      browser.findElement(webdriver.By.id('Password')).sendKeys(password);
      browser.findElement(webdriver.By.name('Answer')).click();
      return browser.getCurrentUrl();
    case 'box':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.name('login')).sendKeys(username);
      browser.findElement(webdriver.By.name('password')).sendKeys(password);
      browser.findElement(webdriver.By.name('login_submit')).click();
      browser.findElement(webdriver.By.name('consent_accept')).click();
      return browser.getCurrentUrl();
    case 'sharefile':
      browser.get(r.body.oauthUrl);
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('credentials-email')), 3000);
      browser.findElement(webdriver.By.id('credentials-email')).sendKeys(username);
      browser.findElement(webdriver.By.id('credentials-password')).sendKeys(password);
      browser.findElement(webdriver.By.id('start-button')).click();
      browser.wait(() => {
        return browser.getTitle().then((title) => !title);
      }, 20000);
      return browser.getCurrentUrl();
    case 'shopify':
      browser.get(r.body.oauthUrl);
      browser.wait(webdriver.until.elementLocated(webdriver.By.name('login')), 1000);
      browser.findElement(webdriver.By.name('login')).clear();
      browser.findElement(webdriver.By.name('login')).sendKeys(username);
      browser.findElement(webdriver.By.name('password')).clear();
      browser.findElement(webdriver.By.name('password')).sendKeys(password);
      browser.findElement(webdriver.By.name('commit')).click();

      browser.wait(() => browser.isElementPresent(webdriver.By.xpath('//div[@id="app-install"]/form/input[@type="submit"]')), 5000)
        .thenCatch(r => true); // ignore

      browser.findElement(webdriver.By.xpath('//div[@id="app-install"]/form/input[@type="submit"]'))
        .then((element) => element.click(), (err) => {}); // ignore this

      return browser.getCurrentUrl();
    case 'dropboxbusiness':
    case 'dropbox':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.xpath('//input[@name="login_email"]')).sendKeys(username);
      browser.findElement(webdriver.By.xpath('//input[@name="login_password"]')).sendKeys(password);
      browser.findElement(webdriver.By.className('login-button button-primary')).click();

      // dropbox for business handling but failing silently
      browser.wait(() => browser.isElementPresent(webdriver.By.xpath('//*[@id="authorize-form-multiaccount"]/button[2]')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.xpath('//*[@id="authorize-form-multiaccount"]/button[1]'))
        .then((element) => element.click(), (err) => {}); // ignore this

      // non-dropbox for business handling but failing silently
      browser.wait(() => browser.isElementPresent(webdriver.By.xpath('//*[@id="authorize-form"]/button[2]')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.xpath('//*[@id="authorize-form"]/button[2]'))
        .then((element) => element.click(), (err) => {}); // ignore this

      browser.wait(() => {
        return browser.getTitle().then((title) => !title);
      }, 5000);

      return browser.getCurrentUrl();
    case 'facebookleadads':
    case 'facebooksocial':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('email')).clear();
      browser.findElement(webdriver.By.id('email')).sendKeys(username);
      browser.findElement(webdriver.By.id('pass')).clear();
      browser.findElement(webdriver.By.id('pass')).sendKeys(password);
      browser.findElement(webdriver.By.id('loginbutton')).click();
      return browser.getCurrentUrl();
    case 'eloqua':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.xpath('//*[@id="login-button"]')).click();
      browser.findElement(webdriver.By.xpath('//*[@id="sitename"]')).sendKeys(config['company.name']);
      browser.findElement(webdriver.By.xpath('//*[@id="username"]')).sendKeys(username);
      browser.findElement(webdriver.By.xpath('//*[@id="password"]')).sendKeys(password);
      browser.findElement(webdriver.By.xpath('//*[@id="submitButton"]')).click();
      browser.findElement(webdriver.By.xpath('//*[@id="accept"]')).click();
      browser.findElement(webdriver.By.xpath('//*[@id="accept"]')).click();
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
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('Email')).sendKeys(username);
      browser.findElement(webdriver.By.id('next')).click();
      browser.sleep(2000);
      browser.findElement(webdriver.By.id('Passwd')).sendKeys(password);
      browser.findElement(webdriver.By.id('signIn')).click();
      browser.sleep(2000);
      browser.findElement(webdriver.By.id('submit_approve_access')).click();
      browser.sleep(2000);
      return browser.getCurrentUrl();
    case 'gotowebinar':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.name('emailAddress')).sendKeys(username);
      browser.findElement(webdriver.By.name('password')).sendKeys(password);
      browser.findElement(webdriver.By.name('submit')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.name('allow')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.name('allow'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'hubspot':
    case 'hubspotcrm':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('username')).sendKeys(username);
      browser.findElement(webdriver.By.id('password')).sendKeys(password);
      browser.findElement(webdriver.By.id('loginBtn')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.className('accept')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.className('accept'))
        .then((element) => element.click(), (err) => {}); // ignore this
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
    case 'infusionsoftecommerce':
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
    case 'mailchimpv3':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('username')).sendKeys(username);
      browser.findElement(webdriver.By.id('password')).sendKeys(password);
      browser.findElement(webdriver.By.css('input.button.p0')).click();
      return browser.getCurrentUrl();
    case 'magento':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('username')).sendKeys(username);
      browser.findElement(webdriver.By.id('login')).sendKeys(password);
      browser.findElement(webdriver.By.className('form-button')).click();
      browser.wait(() => {
        browser.findElement(webdriver.By.xpath("/html/body/div/div/div/div[1]/form[1]/button/span/span"))
          .then((element) => element.click(),
            (err) => {
              if (err.state && err.state === 'no such element') { // ignore this
              } else { webdriver.promise.rejected(err); }
            });
        return browser.getTitle().then((title) => !title);
      }, 10000);
      return browser.getCurrentUrl();
    case 'marketo':
      return 'https://foo.bar.com?code=' + config.code; // good gracious, why does this work?...
    case 'namely':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
      browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
      browser.findElement(webdriver.By.className('to-login')).click();
      browser.findElement(webdriver.By.xpath('/html/body/div[1]/div[3]/section/div/div/div/form[2]/div/button')).click();
      return browser.getCurrentUrl();
    case 'onedrivev2':
      browser.get(r.body.oauthUrl);
      browser.isElementPresent(webdriver.By.id('i0116'));
      browser.findElement(webdriver.By.id('i0116')).sendKeys(username);
      browser.findElement(webdriver.By.id('idSIButton9')).click();
      browser.sleep(3000);
      browser.findElement(webdriver.By.id('i0118')).sendKeys(password);
      browser.findElement(webdriver.By.id('idSIButton9')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.id('idBtn_Accept')), 3000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.id('idBtn_Accept'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'onedrive':
      browser.get(r.body.oauthUrl);
      browser.isElementPresent(webdriver.By.id('i0116'));
      browser.findElement(webdriver.By.id('i0116')).sendKeys(username);
      browser.sleep(3000);
      browser.findElement(webdriver.By.id('idSIButton9')).click();
      browser.sleep(3000);
      browser.findElement(webdriver.By.id('i0118')).sendKeys(password);
      browser.findElement(webdriver.By.id('idSIButton9')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.id('idBtn_Accept')), 3000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.id('idBtn_Accept'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'onedrivebusiness':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('cred_userid_inputtext')).sendKeys(username);
      browser.findElement(webdriver.By.id('cred_password_inputtext')).sendKeys(password);
      // well, not proud of this one...i thought i could use the same as sharepoint but i couldn't.  this keeps clicking the sign-in button until the title goes blank, indicating we
      // have hit our redirect URL...i think (it works :/)
      browser.wait(() => {
        browser.findElement(webdriver.By.id('cred_sign_in_button'))
          .then((element) => element.click(),
            (err) => {
              if (err.state && err.state === 'no such element') { // ignore this
              } else { webdriver.promise.rejected(err); }
            });
        return browser.getTitle().then((title) => !title);
      }, 10000);
      return browser.getCurrentUrl();
    case 'quickbooks':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.name('Email')).sendKeys(username);
      browser.findElement(webdriver.By.name('Password')).sendKeys(password);
      browser.findElement(webdriver.By.id('ius-sign-in-submit-btn')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.name('companySelectionWidgetCompanySelector_href')), 10000)
        .thenCatch(r => true);
      browser.findElement(webdriver.By.name('companySelectionWidgetCompanySelector_href'))
        .then((element) => element.click(), (err) => {}); // ignore this
      browser.wait(() => browser.isElementPresent(webdriver.By.id('authorizeBtn')), 5000)
        .thenCatch(r => true);
      browser.findElement(webdriver.By.id('authorizeBtn')).click();
      browser.sleep(5000); // So flaky, quickbooks' 302 takes forever
      return browser.getCurrentUrl();
    case 'servicenowoauth':
      return 'https://foo.bar.com?code=' + config.code; // they don't supply a code
    case 'servicemax':
    case 'sagelive':
    case 'sfdc':
    case 'sfdcservicecloud':
    case 'sfdcmarketingcloud':
    case 'sfdcdocuments':
    case 'sfdclibraries':
      browser.get(r.body.oauthUrl);
      // wait for username to show up
      browser.wait(webdriver.until.elementLocated(webdriver.By.name('username')), 10000);
      browser.findElement(webdriver.By.id('username')).clear();
      browser.findElement(webdriver.By.id('username')).sendKeys(username);
      browser.findElement(webdriver.By.id('password')).clear();
      browser.findElement(webdriver.By.id('password')).sendKeys(password);
      browser.findElement(webdriver.By.id('Login')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.id('oaapprove')), 10000)
        .thenCatch(r => true); // ignore

      browser.findElement(webdriver.By.id('oaapprove'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'sage200':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.name('sso.Email')).sendKeys(username);
      browser.findElement(webdriver.By.name('sso.Password')).sendKeys(password);
      browser.findElement(webdriver.By.className('submit floatRight')).click();
      return browser.getCurrentUrl();
    case 'sageoneus':
      browser.manage().deleteAllCookies();
      browser.get(r.body.oauthUrl);
      browser.wait(() => browser.isElementPresent(webdriver.By.id('us')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.id('us'))
        .then((element) => element.click(), (err) => {}); // ignore this
      browser.wait(() => {
        return browser.isElementPresent(webdriver.By.id('sso_Email')); //slow load time for login screen
      }, 10000);
      browser.findElement(webdriver.By.id('sso_Email')).sendKeys(username);
      browser.findElement(webdriver.By.id('sso_Password')).sendKeys(password);
      browser.findElement(webdriver.By.className('button primary green')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.className('primary')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.className('primary'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'sageoneuk':
      browser.get(r.body.oauthUrl);
      browser.wait(() => browser.isElementPresent(webdriver.By.id('uk')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.id('uk'))
        .then((element) => element.click(), (err) => {}); // ignore this
      browser.wait(() => {
        return browser.isElementPresent(webdriver.By.id('sso_Email')); //slow load time for login screen
      }, 10000);
      browser.findElement(webdriver.By.id('sso_Email')).sendKeys(username);
      browser.findElement(webdriver.By.id('sso_Password')).sendKeys(password);
      browser.findElement(webdriver.By.className('action full-width')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.className('primary')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.className('primary'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'sharepoint':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('cred_userid_inputtext')).sendKeys(username);
      browser.findElement(webdriver.By.id('cred_password_inputtext')).sendKeys(password);
      browser.wait(() => {
        browser.findElement(webdriver.By.id('cred_sign_in_button')).click(); // ... i'm serious, you have to just keep clicking.  wtf microsoft.
        return browser.isElementPresent(webdriver.By.id('ctl00_PlaceHolderMain_BtnAllow'));
      }, 10000);
      browser.findElement(webdriver.By.id('ctl00_PlaceHolderMain_BtnAllow')).click();
      return browser.getCurrentUrl();
    case 'wrike':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('emailField')).sendKeys(username);
      browser.findElement(webdriver.By.id('passwordField')).sendKeys(password);
      browser.findElement(webdriver.By.id('submit-login-button')).click();
      //Only needed first time
      //browser.findElement(webdriver.By.id('user_oauth_approval')).click();
      return browser.getCurrentUrl();
    case 'zendesk':
      browser.get(r.body.oauthUrl);
      browser.switchTo().frame(0);
      browser.findElement(webdriver.By.id('user_email')).sendKeys(username);
      browser.findElement(webdriver.By.id('user_password')).sendKeys(password);
      browser.findElement(webdriver.By.name('commit')).click();
      return browser.wait(() => browser.isElementPresent(webdriver.By.id('user-approval')), 5000)
        .then(r => browser.findElement(webdriver.By.xpath('//*[@id="user-approval"]/form[2]/input[6]')))
        .then(r => r.click())
        .then(r => browser.getCurrentUrl())
        .catch(r => browser.getCurrentUrl());

    case 'sapanywhere':
      browser.get(r.body.oauthUrl);
      browser.wait(() => browser.isElementPresent(webdriver.By.name('emailInput')), 5000)
        .thenCatch(r => true);
      browser.findElement(webdriver.By.name('emailInput')).sendKeys(username);
      browser.findElement(webdriver.By.name('loginInputPwd')).sendKeys(password);
      browser.findElement(webdriver.By.name('loginButton')).click();
      browser.wait(() => browser.isElementPresent(webdriver.By.xpath('//div[@class="app-install"]/a/input[@type="submit"]')), 5000)
        .thenCatch(r => true); // ignore
      browser.findElement(webdriver.By.xpath('//div[@class="app-install"]/a/input[@type="submit"]'))
        .then((element) => element.click(), (err) => {}); // ignore this
      return browser.getCurrentUrl();
    case 'twitter':
      browser.get(r.body.oauthUrl);
      browser.findElement(webdriver.By.id('username_or_email')).sendKeys(username);
      browser.findElement(webdriver.By.id('password')).sendKeys(password);
      browser.findElement(webdriver.By.id('allow')).click();
      return browser.getCurrentUrl();
    case 'readytalkilluminate':
      browser.get(r.body.oauthUrl);
      browser.wait(webdriver.until.elementLocated(webdriver.By.name('email'), 5000));
      browser.findElement(webdriver.By.name('email')).sendKeys(username);
      browser.findElement(webdriver.By.name('password')).sendKeys(password);
      // browser.manage().window().maximize(); //for maximizing the window size.
      browser.wait(webdriver.until.elementLocated(webdriver.By.xpath('.//*[@id="auth0-lock-container-1"]/div/div[2]/form/div/div/  button'), 5000));
      browser.findElement(webdriver.By.xpath('.//*[@id="auth0-lock-container-1"]/div/div[2]/form/div/div/button')).click();
      browser.sleep(5000);
      return browser.getCurrentUrl();
    default:
      throw 'No OAuth function found for element ' + element + '.  Please implement function in core/oauth so ' + element + ' can be provisioned';
  }
};

const attemptOAuthExchange = (attempt, manipulateDom, element, b, r, username, password, config) => {
  const browser = new webdriver.Builder()
    .forBrowser(b)
    .build();
  return browser.call(() => manipulateDom(element, browser, r, username, password, config))
    .then(url => {
      browser.close();
      return url;
    })
    .catch(e => {
      if (attempt < 3) {
        logger.debug("OAuth exchange failed (%s) on attempt %s, retrying.", e.message, attempt);
        return attemptOAuthExchange(++attempt, manipulateDom, element, b, r, username, password, config);
      } else {
        browser.close();
        logger.error("OAuth exchange failed (%s) after %s attempts", e.message, attempt);
        throw e;
      }
    });
};

/**
 * Provision an OAuth2 element
 * @param  {string} element  The element key to provisioner
 * @param  {Object} r        The HTTP response object from GET /elements/:key/oauth/url
 * @param  {string} username The login username
 * @param  {string} password The login password
 * @param  {Object} config   The other config for this element from churros props
 * @return {Promise}  A promise that resolves to
 */
module.exports = (element, r, username, password, config) => {
  const b = props.get('browser');
  logger.debug('Using the %s browser', b);
  logger.debug('Redirecting to %s', r.body.oauthUrl);
  return attemptOAuthExchange(1, manipulateDom, element, b, r, username, password, config);
};