# featurehub-cloud-events-to-slack

The purpose of this library is to be used in a client (web app, knative sink, lamba, cloud function, etc) - where it takes a [CloudEvent](https://www.npmjs.com/package/cloudevents) and extracts the
necessary information and will post the message to Slack.

It depends on the `featurehub-cloud-event-tools`, `featurehub-slack-sender` and `featurehub-update-converter` projects to be able to do its work.

For more information please see the [main repository documentation](https://github.com/featurehub-io/featurehub-messaging).


