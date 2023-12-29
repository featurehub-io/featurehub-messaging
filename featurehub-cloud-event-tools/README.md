# featurehub-cloud-event-tools

This library holds relevant utilities for FeatureHub's use of CloudEvents, 
specifically in terms of clients who receive messages from CloudEvents emitted from
the Management Repository.

It handles decrypting of `Record<string,string>` dictionaries that are passed by messages,
and parsing the body of the cloud events in case that body has been gzipped (the data content type
is `application/json+gzip`).

For more information please see the [main repository documentation](https://github.com/featurehub-io/featurehub-messaging).
