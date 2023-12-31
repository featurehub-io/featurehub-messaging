# featurehub-update-converter

The purpose of this library is to source a template to use when generating a template. It needs an environment variable called `SOURCE` that indicates where any references passed to it are looked up from, and it has to be `file` (for the reference as a file) or `env` (for it being an environment variable).

It needs to be able to support multiple templates in a single app in case the same app is loading in
and processing multiple CloudEvent types.

