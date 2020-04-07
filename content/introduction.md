## Overview

[The DeFi Score](https://defiscore.io/) is a framework for evaluating DeFi protocols. Based on factors including smart contract risk, collateralization, and liquidity, the model outputs an easy to understand 0–10 rating.

With the **DeFi Score API**, developers can programmatically retrieve the individual scores and additional data points which can then be presented to users or integrated into other systems.

Scoring decentralized lending platforms is a continuous process that depends on many variables.
This API will conveniently provide scores and metrics of every supported asset and platform.
As new data comes online and our model grows, we will introduce new API endpoints allowing for
different views of the scores over time and with different parameters.

The API is in an alpha state as we understand the usage statistics and the preferences of our clients.
We will make changes accordingly to the feedback until we must respect backwards compatibility.

You can sign up for access to our API [at our website](https://codefi.consensys.net/data).

## Service

<img src="https://img.shields.io/badge/version-0.0.6-blue"
     alt="Version Badge"
     style="margin-left:0" />

The DeFi Score API is currently live at this location:

| Environment | URL                                             |
| ----------- | ----------------------------------------------- |
| Production  | `https://data.api.codefi.network/v0/defi-score` |

Breaking changes are assumed at `v0` so there is no need for a staging environment.
However, once `v1` is available, a staging environment will be stood up to test future modules and interfaces.

## Authentication

Authentication is performed using the [OAuth2 Client Credentials Flow](https://auth0.com/docs/flows/concepts/client-credentials) (defined in OAuth 2.0 RFC 6749, section 4.4). Once you have signed up, you will receive a `client_id` and `client_secret`. **Always keep your `client_secret` secure.** These can be used to generate a bearer token that can be supplied in request headers to authenticate your requests to the API.

### Generating a Bearer Token

In order to generate a bearer token, you should following these steps within your implementation:

1. Using your `client_id` and `client_secret`, fetch a bearer token from `https://codefi-prod.eu.auth0.com/oauth/token`
1. Store this token in memory, and for each request, check if it has expired, if so, repeat step 1
1. Use the stored bearer token within the `Authorization` request header to authenticate your requests

#### Quickstart
```curl
export CLIENT_ID="xxx"
export CLIENT_SECRET="yyy"

# Fetch an access token
export ACCESS_TOKEN=$(curl -s --request POST --url 'https://codefi-prod.eu.auth0.com/oauth/token' --header 'content-type: application/x-www-form-urlencoded' --data "audience=https://api.codefi.network&grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" | python -c 'import sys,json; print(json.load(sys.stdin)["access_token"])')
```

#### Access the Defi Score API
```curl
curl -s -X GET \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -iL \
    https://data.api.codefi.network/v0/defi-score/scores
```

## Rate Limits

Requests to the API are rate limited to ensure fair usage. Current usage information is provided in response headers to indicate how close to your client is to hitting the rate limit.

Sample headers:

```
X-RateLimit-Limit-minute: 60
X-RateLimit-Remaining-minute: 39
```
