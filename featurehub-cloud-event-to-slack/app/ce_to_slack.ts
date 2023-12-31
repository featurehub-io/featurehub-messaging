import {CloudEventV1} from "cloudevents";
import {
  CloudEventPublishResult,
  featurehubCloudEventBodyParser,
  SymmetricDecrypter
} from "featurehub-cloud-event-tools";
import {TemplateProcessor} from "featurehub-update-converter";
import {Slack} from "featurehub-slack-sender";


const templateProcessor = new TemplateProcessor();

export async function cloudEventToSlack(event: CloudEventV1<any>) : Promise<CloudEventPublishResult> {
  console.log('event is', event, event.data);

  if (process.env.DEBUG) {
    console.log('checking type of ', event.type);
  }

  if (event.type !== 'integration/slack-v1') { // ok, this is not for us
    return { code: 400, message: `${event.type} is not understood` };
  }

  let update: any | undefined = featurehubCloudEventBodyParser(event);

  if (update === undefined) {
    return {code: 400, message: 'unable to parse body of message'};
  }

  if (process.env.DEBUG) {
    console.log(`received`, JSON.stringify(update, null, 2));
  }

  const decrypt = new SymmetricDecrypter(process.env.FEATUREHUB_PASSWORD);

  const configData = decrypt.decrypt(update.additionalInfo);
  const slackToken = configData['integration.slack.token'];
  const slackChannel = configData['integration.slack.channel_name'];

  if (slackToken && slackChannel) {
    let payload = await templateProcessor.process(update);

    if (process.env.DEBUG) {
      console.log('payload is:\n', payload);
    }

    if (payload) {
      try {
        const result = await (new Slack()).deliver(payload, slackToken, slackChannel);
        return {
          code: result.code,
          message: result.message
        };
      } catch (e) {
        if (process.env.DEBUG) {
          console.error('Slack failure', e);
        }

        return { code: 424, message: 'Talking to Slack failed' };
      }
    } else {
      return { code: 418, message: 'Unable to determine payload for event' };
    }
  } else {
    return {code: 422, message: 'Missing slack token or channel'};
  }

  return {code: 200, message: 'sent ok'};
}