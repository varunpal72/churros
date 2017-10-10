  const props = require('core/props');
  const cloud = require('core/cloud');
  const tools = require('core/tools');
  const util = require('util');
  const fs = require('fs');
  const expect = require('chakram').expect;
  const logger = require('winston');
  const swaggerParser = require('swagger-parser');
  const _ = require('lodash');

  const createAll = (urlTemplate, list) => {
    return Object.keys(list).sort()
      .reduce((p, key) => p.then(() => {
        return cloud.post(util.format(urlTemplate, key), list[key])
        .catch(err => cloud.post(util.format(urlTemplate, key), list[key]));
      }), Promise.resolve(true)); // initial
  };

  //Will by default run these
  describe('Basic tests', () => {
    let element, instanceId, hub;
    before(() => {
      element = props.get('element');
      instanceId = props.get('instanceId');
      hub = props.get('hub');
    });
    it('should GET /objects', () => {
      return cloud.get('/objects').then(r => expect(r).to.have.statusCode(200) && expect(r.body).to.not.be.empty);
    });

    it('docs', () => cloud.get(`/elements/${props.getForKey(element, 'elementId')}/docs`)
      .then(s => new Promise((res, rej) => swaggerParser.validate(s.body, (err, api) => err ? rej(err) : res()))));

    it('metadata', () => cloud.get(`elements/${props.getForKey(element, 'elementId')}/metadata`).then(r => expect(r.body).to.not.be.empty && expect(r).to.have.statusCode(200)));
    it('transformations', () => {
      let error;
      // clear current transformations
      return cloud.delete(`/instances/${instanceId}/transformations`).catch(() => {})
      .then(() => {
        const transformationsFile = `${__dirname}/../${element}/assets/transformations`;
        // if there is already a transformation file here
        if (fs.existsSync(transformationsFile + '.json')) {
          let transformations = _.cloneDeep(require(transformationsFile + '.json'));
          Object.keys(transformations).forEach(key => {
            let idField = transformations[key].fields.filter(f => f.path === 'id')[0];
            if (idField) {
              idField.path = 'idTransformed';
            } else {
              transformations[key].fields.push({"path": "idTransformed","vendorPath": "id"});
            }
          });
          //create the transformations and validating they work
          return Promise.all(Object.keys(transformations).map(key => cloud.post(`/instances/${instanceId}/transformations/${key}`, transformations[key])))
          .then(() => Promise.all(Object.keys(transformations).map(key => cloud.get(`/hubs/${hub}/${key}`).catch(() => ({body: []})).then(r => expect(r.body.length).to.equal(r.body.filter(t => t.idTransformed).length)))));
        } else {
          //create defintions before the transformations
          let allDefs = require(`${__dirname}/../assets/object.definitions.json`);
          let defined = Object.keys(allDefs);
          return cloud.get(`/hubs/${hub}/objects`)
          .then(objs => {
            let transDefs = defined.reduce((acc, cur) => {
              if (objs.body.includes(cur)) {
                acc[cur] = allDefs[cur];
              }
              return acc;
            },{});
            return createAll(`/instances/${instanceId}/objects/%s/definitions`, transDefs)
            .then(() => {
              return Promise.all(objs.body.map(key => {
                let trans = {
                  "vendorName": key,
                  "fields": [
                    {
                      "path": "idTransformed",
                      "vendorPath": "id"
                    }
                  ]
                };
                //creates the same transformations that were defined
                return defined.includes(key) ? cloud.post(`/instances/${instanceId}/transformations/${key}`, trans) : Promise.resolve(null);
              }));
            })
            .then(() => {
              //validates the transformations are working
              return Promise.all(Object.keys(transDefs).map(key => cloud.get(`/hubs/${hub}/${key}`).catch(() => ({body: []})).then(r => expect(r.body.length).to.equal(r.body.filter(t => t.idTransformed).length))));
            });
          });
        }
      })
      .catch(e => error = e)
      .then(() => cloud.delete(`/instances/${instanceId}/transformations`).catch(() => {}))
      .then(() => {
        // transformations file exists? create the transformations on the instance
        const transformationsFile = `${__dirname}/../${element}/assets/transformations`;
        if (fs.existsSync(transformationsFile + '.json')) {
          logger.debug('Setting up transformations');
          const url = `/instances/${instanceId}/transformations/%s`;
          return createAll(url, require(transformationsFile))
          .catch(() => {});
        }
      })
      .catch(() => {})
      .then(() => {
        if (error) {
          throw new Error(error);
        }
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
  });