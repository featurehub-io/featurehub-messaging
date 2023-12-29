#!/bin/sh
# see Fyodor, with Maven I wouldn't have to do this, it would just work.
# these three are independent
cd featurehub-cloud-event-tools
npm install && npm run link
cd ../featurehub-update-converter
npm install && npm run link
cd ../featurehub-slack-sender
npm install && npm run link
# this needs the above three
cd ../featurehub-cloud-event-to-slack
npm install && npm run setup && npm run link
# this needs the above 1
cd ../messaging-server
npm install && npm run setup