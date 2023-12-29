import axios from "axios";

interface SlackSenderResponse {
  code: number; // 200 = ok, anything else a failure
  message: string;
}

interface SlackText {
  type: string;
  text: string;
}

const TEXT_MARKDOWN = 'mrkdwn';

interface SlackBlock {
  type: string;
  text?: SlackText;
  fields?: Array<SlackText>;
}

export class Slack {
  async deliver(body: string, slackToken: string, slackChannel: string) : Promise<SlackSenderResponse> {
    const message = [{
      type: 'section',
      text: {
        type: TEXT_MARKDOWN,
        text: body
      }
    }]
    try {
      const result = await axios.post('https://slack.com/api/chat.postMessage', {
        channel: slackChannel,
        blocks: message
      }, {
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-type': 'application/json; charset=utf-8'
        }
      });

      if (result.status != 200 || !result.data) {
        const msg = `failed to update slack with result ${result.status}: ${result.statusText} - ${result.data}`;
        if (process.env.DEBUG) {
          console.error(msg);
        }
        return {code: 400, message: msg};
      } else {
        if (!result.data?.ok) {
          if (process.env.DEBUG) {
            console.error('failed to post to slack', result.data);
          }
          return {code: 400, message: result.statusText};
        }
      }
    } catch (e: any) {
      if (process.env.DEBUG) {
        console.error('update failed', e);
      }
      return {code: 400, message: e.message || 'slack post failed'}
    }

    return {code:200, message: 'posted to slack ok'};
  }
}
