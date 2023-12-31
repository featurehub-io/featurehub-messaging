import * as express from 'express';
import { CloudEventV1, HTTP } from 'cloudevents';
import { cloudEventToSlack } from 'featurehub-cloud-event-to-slack';

const app = express();
// we always want the raw body
// https://stackoverflow.com/questions/9920208/expressjs-raw-body
app.use (function (req, res, next) {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });

  req.on('end', function () {
    req.body = data;
    next();
  });
});

if (!process.env.FEATUREHUB_PASSWORD) {
  console.error('Unable to start due to missing password');
  process.exit(1);
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

app.get('/health/readiness', (request, response) => {
  response.status(200).send('ok');
});

app.get('/health/liveness', (request, response) => {
  response.status(200).send('ok');
});

app.post('/featurehub/slack', async (request, response, next) => {
  let status = 400;
  let message = 'unknown failure';

  try {
    if (process.env.DEBUG) {
      console.log('decoding cloud event');
    }

    const event = HTTP.toEvent<any>({ headers: request.headers, body: request.body }) as CloudEventV1<any>;

    const result = await cloudEventToSlack(event);

    status = result.code;
    message = result.message;
  } catch (e) {
    console.log('failed', e);
  } finally {
    response.status(status).send(message);
    next();
  }
});


app.listen(parseInt(process.env.PORT || '3000'), () => {
  console.log('Listening on port 3000');
});
