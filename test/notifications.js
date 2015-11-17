'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

// load the JSON schemas to validate against
const notificationSchema = require('./notification.schema.json');
const subscriptionSchema = require('./subscription.schema.json');

describe('notifications and subscriptions APIs', () => {
  const url = '/notifications';

  it('should allow creating, retrieving and deleting a notification', () => {
    const notification = {
      severity: 'low',
      topic: 'churros-topic',
      message: 'this is a test message',
      from: 'churros'
    };

    return chakram.post(url, notification)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(notificationSchema);

        return chakram.get(url + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(notificationSchema);
        expect(r.body.severity).to.equal(notification.severity);
        expect(r.body.topic).to.equal(notification.topic);
        expect(r.body.message).to.equal(notification.message);

        return chakram.delete(url + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should return one notification when searching for this topic', function () {
    const randomTopic = 'churros-topic-' + Math.random().toString(36).substring(7);
    const randomNotification = {
      message: "this is a test message",
      from: "churros",
      severity: "low",
      topic: randomTopic
    };
    return chakram.post(url, randomNotification)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(notificationSchema);

        return chakram.get(url + '?topics[]=' + randomTopic);
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);

        return chakram.delete(url + '/' + r.body[0].id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should allow acknowledging a notification', function () {
    const notification = {
      severity: 'low',
      topic: 'churros-topic',
      message: 'this is a test message',
      from: 'churros'
    };

    return chakram.post(url, notification)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(notificationSchema);
        expect(r.body.acknowledged).to.equal(false);

        return chakram.put(url + '/' + r.body.id + '/acknowledge');
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.acknowledged).to.equal(true);

        return chakram.delete(url + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should return an empty array if no notifications are found with the given topic', function () {
    return chakram.get(url + '?topics[]=fake-topic-name')
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.be.empty;
      });
  });

  it('should throw a 400 if missing search query', function () {
    return chakram.get(url).then((r) => {
      expect(r).to.have.status(400);
    });
  });

  it('should throw a 404 if the notification does not exist', function () {
    return chakram.get(url + '/' + -1).then((r) => {
      expect(r).to.have.status(404);
    });
  });

  it('should throw a 400 if notification JSON is null', function () {
    return chakram.post(url, null)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });

  it('should throw a 400 if missing fields when creating a notification', function () {
    const badNotification = {
      topic: null,
      message: 'this is a test message',
      severity: 'low'
    };
    return chakram.post(url, badNotification)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });

  it('should allow creating, retrieving and deleting a subscription', function () {
    const subscription = {
      channel: 'webhook',
      topics: ['churros-topic'],
      config: {
        url: 'http://fake.churros.url.com'
      }
    };
    const subscriptionUrl = url + '/subscriptions';

    return chakram.post(subscriptionUrl, subscription)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(subscriptionSchema);

        return chakram.get(subscriptionUrl + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(subscriptionSchema);
        expect(r.body.topic).to.equal(subscription.topic);
        expect(r.body.channel).to.equal(subscription.channel);

        return chakram.delete(subscriptionUrl + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should throw a 400 if an email subscription is missing an email address', function () {
    const subscriptionUrl = url + '/subscriptions';
    const badSubscription = {
      channel: 'email',
      topics: ['churros-topic']
    };
    return chakram.post(subscriptionUrl, badSubscription)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });

  it('should throw a 404 if the subscription ID does not exist', function () {
    const subscriptionUrl = url + '/subscriptions';
    return chakram.get(subscriptionUrl + '/' + -1).then((r) => {
      expect(r).to.have.status(404);
    });
  });
});
