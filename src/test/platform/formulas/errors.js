'use strict';

const common = require('./assets/common');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const suite = require('core/suite');

suite.forPlatform('formulas', { name: 'formula executions' }, (test) => {

  /**
   * Handles the basic formula execution test for a formula that has a manual trigger type
   */
  const testIt = (fName, configuration, numSevs, execValidator, instanceValidator, executionStatus, numInstances) => {
    const f = require(`./assets/formulas/${fName}`);
    let fi = { name: 'churros-manual-formula-instance' };

    if (configuration) {
        fi.configuration = configuration;
    }

    const execValidatorWrapper = (executions, fId, fiId) => {
      executions.map(e => {
        e.stepExecutions.filter(se => se.stepName === 'trigger')
          .map(t => {
            expect(t.stepExecutionValues.length).to.equal(1);
            const sev = t.stepExecutionValues[0];
            expect(sev).to.have.property('key').and.equal('trigger.args');
          });
      });
      if (typeof execValidator === 'function') return execValidator(executions, fId, fiId);
    };

    const instanceValidatorWrapper = fId => {
      if (typeof instanceValidator === 'function') return instanceValidator(fId);
      return Promise.resolve(true);
    };

    const triggerCb = (fId, fiId) =>
      Promise.all(tools.times(3)(() => cloud.post(`/formulas/${fId}/instances/${fiId}/executions`, { foo: 'bar' })));

    const numSes = f.steps.length + 1; // steps + trigger
    return common.testWrapper(test, triggerCb, f, fi, 3, numSes, numSevs, execValidatorWrapper, instanceValidatorWrapper, executionStatus, numInstances || 1);
  };

  it('should return the error for a failed execution', () => {
    const execValidator = (executions, fId, fiId) => {

      return Promise.all(executions.map(e => {
        cloud.get(`/formulas/instances/executions/${e.id}/errors`)
        .then(r => {
          expect(r.body).to.have.lengthOf(1);
          r.body.map(e => {
            expect(e.status).to.equal('failed');
            expect(e.stepExecutions).to.have.lengthOf(1);
            expect(e.stepExecutions[0].status).to.equal('failed');
          });
        });
      }));
    };

    return testIt('simple-error-formula-manual-v2', {}, 2, execValidator, null, 'failed', 1);
  });

  it('should return 3 executions with errors for 3 failed executions', () => {
    const execValidator = (executions, fId, fiId) => {
      let first;

      // Get all 3 executions, each with errors
      return cloud.get(`/formulas/instances/${fiId}/executions/errors`)
      .then(r => {
        expect(r.body).to.have.lengthOf(3);
        r.body.map(e => {
          expect(e.status).to.equal('failed');
          expect(e.stepExecutions).to.have.lengthOf(1);
          expect(e.stepExecutions[0].status).to.equal('failed');
        });
      })
      // Get just the first page with page size 1
      .then(() => cloud.get(`/formulas/instances/${fiId}/executions/errors?pageSize=1`))
      .then(r => {
        expect(r.body).to.have.lengthOf(1);
        expect(r).to.have.header('Elements-Next-Page-Token');
        first = r.body[0].id;
        return r.response.headers['elements-next-page-token'];
      })
      // Get page 2 with page size 1 and make sure it's not the same ID as page 1
      .then(np => cloud.get(`/formulas/instances/${fiId}/executions/errors?pageSize=1&nextPage=${np}`))
      .then(r => {
        expect(r.body).to.have.lengthOf(1);
        expect(r.body[0].id).to.not.equal(first);
      })
      // Get the errors by date (1 hour ago to 1 hour in the future), which should have all 3 instances
      .then(np => {
        const from = new Date();
        from.setHours(from.getHours() - 1);
        const to = new Date();
        to.setHours(to.getHours() + 1);

        return cloud.get(`/formulas/instances/${fiId}/executions/errors?from=${from.toJSON()}&to=${to.toJSON()}`);
      })
      .then(r => expect(r.body).to.have.lengthOf(3))
      // Get the errors by date (1 to 2 hours in the future), which should return an empty array
      .then(np => {
        const from = new Date();
        from.setHours(from.getHours() + 1);
        const to = new Date();
        to.setHours(to.getHours() + 2);

        return cloud.get(`/formulas/instances/${fiId}/executions/errors?from=${from.toJSON()}&to=${to.toJSON()}`);
      })
      .then(r => expect(r.body).to.have.lengthOf(0));
    };

    return testIt('simple-error-formula-manual-v2', {}, 2, execValidator, null, 'failed', 1);
  });

  it('should return 3 instances with 3 executions with errors for 9 failed executions', () => {
    const instanceValidator = fId => {
      let first;

      // Get all 3 instances with 3 executions, each with errors
      return cloud.get(`/formulas/${fId}/instances/executions/errors`)
      .then(r => {
        expect(r.body).to.have.lengthOf(3);
        r.body.map(i => {
          expect(i.executions).to.have.lengthOf(3);
          expect(i.executions[0].status).to.equal('failed');
          expect(i.executions[0].stepExecutions).to.have.lengthOf(1);
          expect(i.executions[0].stepExecutions[0].status).to.equal('failed');
        });
      })
      // Get just the first page with page size 1
      .then(() => cloud.get(`/formulas/${fId}/instances/executions/errors?pageSize=1`))
      .then(r => {
        expect(r.body).to.have.lengthOf(1);
        expect(r).to.have.header('Elements-Next-Page-Token');
        first = r.body[0].id;
        return r.response.headers['elements-next-page-token'];
      })
      // Get page 2 with page size 1 and make sure it's not the same ID as page 1
      .then(np => cloud.get(`/formulas/${fId}/instances/executions/errors?pageSize=1&nextPage=${np}`))
      .then(r => {
        expect(r.body).to.have.lengthOf(1);
        expect(r.body[0].id).to.not.equal(first);
      })
      // Get the errors by date (1 hour ago to 1 hour in the future), which should have all 3 instances
      .then(() => {
        const from = new Date();
        from.setHours(from.getHours() - 1);
        const to = new Date();
        to.setHours(to.getHours() + 1);

        return cloud.get(`/formulas/${fId}/instances/executions/errors?from=${from.toJSON()}&to=${to.toJSON()}`);
      })
      .then(r => {
        expect(r.body).to.have.lengthOf(3);
      })
      // Get the errors by date (1 to 2 hours in the future), which should return an empty array
      .then(() => {
        const from = new Date();
        from.setHours(from.getHours() + 1);
        const to = new Date();
        to.setHours(to.getHours() + 2);

        return cloud.get(`/formulas/${fId}/instances/executions/errors?from=${from.toJSON()}&to=${to.toJSON()}`);
      })
      .then(r => {
        expect(r.body).to.have.lengthOf(0);
      });
    };

    return testIt('simple-error-formula-manual-v2', {}, 2, null, instanceValidator, 'failed', 3);
  });
});
