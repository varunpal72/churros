'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const branding = require('./assets/branding.schema');

suite.forPlatform('organizations/branding', {schema: branding}, test => {
  const cleanup = () => {
    return cloud.delete('/organizations/branding', () => true);
  };

  before(cleanup);

  const branding = {
    headerFont: 'Helvetica',
    headerColor: '586f75',
    bodyFont: 'Helvetica',
    bodyColor: 'aedce7',
    logo: 'https://cloud-elements.com/wp-content/uploads/2017/06/ce_full_color-menu.png',
    favicon: 'https://cloud-elements.com/wp-content/uploads/2017/06/ce_full_color-menu.png',
    themePrimaryColor: '586f75',
    themeSecondaryColor: 'aedce7',
    themeHighlightColor: '468499',
    buttonPrimaryBackgroundColor: 'cc6649',
    buttonPrimaryTextColor: 'aedce7',
    buttonSecondaryBackgroundColor: 'aedce7',
    buttonSecondaryTextColor: 'cc6649',
    buttonDeleteBackgroundColor: 'eeeeee',
    buttonDeleteTextColor: 'FFFFFF',
    logoBackgroundColor: 'ffffff',
    topBarBackgroundColor: 'aedce7',
    navigationBackgroundColor: 'aedce7',
    contextBackgroundColor: 'aedce7',
  };

  it('should support upserting, retrieving and deleting a branding for a company', () => {
    return cloud.put('/organizations/branding', branding)
      .then(r => {
        expect(r.body.bodyFont).to.equal('Helvetica');
        branding.bodyFont = 'Arial';
      })
      .then(() => cloud.put('/organizations/branding', branding))
      .then(r => {
        expect(r.body.bodyFont).to.equal('Arial');
      })
      .then(() => cloud.get(`/organizations/branding`))
      .then(r => {
        expect(r.body.bodyFont).to.equal('Arial');
      })
      .then(() => cloud.delete(`/organizations/branding`));
  });

  it('should support saving a logo for the branding for a company', () => {
    return cloud.put('/organizations/branding', branding)
      .then(r => {
        expect(r.body.logo).to.equal('https://cloud-elements.com/wp-content/uploads/2017/06/ce_full_color-menu.png');
      })
      .then(() => cloud.patchFile('/organizations/branding/logo', __dirname + `/assets/logo.png`))
      .then(() => cloud.get(`/organizations/branding`))
      .then(r => {
        expect(r.body.logo).to.contain('https://images.cloudelements.io/logo');
      })
      .then(() => cloud.patchFile('/organizations/branding/favicon', __dirname + `/assets/favicon.png`))
      .then(() => cloud.get(`/organizations/branding`))
      .then(r => {
        expect(r.body.favicon).to.contain('https://images.cloudelements.io/favicon');
      })
      .then(() => cloud.delete(`/organizations/branding`));
  });




});
