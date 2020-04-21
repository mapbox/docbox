## Inspect Data

The `inspect` resource is available at this location:

Environment | Location
--- | ---
Production | `https://data.api.codefi.network/v0/inspect`

<!-- A _score_ contains fields relating to an _asset_ by a _platform_.
The `scores` resource is computed every `6` hours and is cached at `1` hour.
The shape of `scores` will grow or shrink depending on the fields that need to be exposed. -->

A _protocol_ contains fields relating to a protocol's configuration, like admin keys, governance, audits and oracles. The data is sources from [this Github repo](https://github.com/ConsenSys/inspect-data/)

We make use of HTTP status codes to communicate the result of the request. These status codes are currently supported:

Status Code | Description
--- | ---
`200` | The response was successful and there scores present.
`400` | The request was invalid and did not map to our requirements.
`404` | The resource that was requested was not found.
`429` | The global rate limiter for the API has been reached, backoff strategy suggested.

We try to keep the responses minimal, only serving the most important bits to keep response sizes small.
The fields of a _score_ are defined as follows:

Field | Description
--- | ---
`machineName` | The name of the protocol without any formatting
`displayName` | The name of the protocol with formatting
`description` | A short description of the protocol
`audits` | A list of audits that the protocol has received with metadata
`adminTraits` | Information around admin keys such as address, timelock duration and whether the admin key uses a multisig

### List All Data

Lists all current scores from the latest calcuation.

```endpoint
GET /v0/inspect
```

#### Example request

```curl
$ curl -X GET https://data.api.codefi.network/v0/inspect
```

#### Example response

```json
[
  {
    "machineName": "{platform}",
    "displayName": "{platform}",
    "description": "string",
    "audits": [{
      "date": "number",
      "auditor": "string",
      "engineeringWeeks": "number | null",
      "public": "boolean",
      "notes": "string",
      "link": "string",
    }],
    "adminTraits": [{
      "timelockEnabled": "boolean",
      "timelockHours": {
        "hours": "number"
      },
      "multisigEnabled": "boolean",
      "multisigOf": "string",
      "opsecClaimed": "boolean",
      "opsecClaimedNote": "string",
      "opsecVerified": "boolean",
      "opsecVerifiedNote": "string",
      "address": "string"
    }]
  },
  ...
]
```
