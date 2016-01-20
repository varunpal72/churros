'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const subscriptionSchema = require('./assets/subscription.schema');

describe('subscriptions', () => {
  const url = '/notifications/subscriptions';

  it('should allow creating, retrieving and deleting a subscription', () => {
    const subscription = {
      channel: 'webhook',
      topics: ['churros-topic'],
      config: {
        url: 'http://fake.churros.url.com'
      }
    };

    return chakram.post(url, subscription)
      .then(r => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(subscriptionSchema);

        return chakram.get(url + '/' + r.body.id);
      })
      .then(r => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(subscriptionSchema);
        expect(r.body.topic).to.equal(subscription.topic);
        expect(r.body.channel).to.equal(subscription.channel);

        return chakram.delete(url + '/' + r.body.id);
      })
      .then(r => {
        expect(r).to.have.status(200);
      });
  });

  it('should throw a 400 if an email subscription is missing an email address', () => {
    const badSubscription = {
      channel: 'email',
      topics: ['churros-topic']
    };
    return chakram.post(url, badSubscription)
      .then(r => {
        expect(r).to.have.status(400);
      });
  });

  it('should throw a 404 if the subscription ID does not exist', () => {
    return chakram.get(url + '/' + -1).then((r) => {
      expect(r).to.have.status(404);
    });
  });

  it('should throw a 400 if you pass invalid fields when creating a subscription', () => {
    const badSubscription = {
      channel: 'email',
      badField: ''
    };
    return chakram.post(url, badSubscription).then((r) => {
      expect(r).to.have.status(400);
    });
  });
});
