'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forPlatform('docs', (test) => {
  let hubs;

  before(() => cloud.get('/elements')
    .then(r => hubs = r.body.reduce((p, c) => {
      if(c.active) { p.add(c.hub); }
      return p;
    }, new Set())));

  it('should return proper JSON', () => {
    // return Promise.all(hubs.map(h => {
    //   return chakram.get(`/hubs/${h.key}/elements`)
    //   .then(r => {
    //     if(r.response.statusCode !== 200 || r.body.filter(e => e.active).count === 0) {
    //       return ({ active: false, key: h.key });
    //     }
    //     return ({ active: h.active, key: h.key });
    //   });
    // }))
    // .then(hs => hs.filter(h => h.active))
    return Promise.all(Array.from(hubs).map(h => {
      return chakram.get(`/docs/${h}`)
      .then(r => {
        expect(r.response.statusCode).to.equal(200, `${h} hub documentation failed`);
        return r.body;
      })
      .then(s => console.log(s));
    }));
    //.then(rs => rs.map(r => { expect(r).to.have.status(200, `Hub `); return r.body; }))
  });
});
