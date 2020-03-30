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

Bearer authentication is required to interact with the API. Clients must send their bearer token in the `Authorization` request header.

```
Authorization: Bearer <token>
```

Your bearer token will be provided to you when you sign up.

## Rate Limits

Requests to the API are rate limited to ensure fair usage. Usage is provided in response headers to indicate how close to rate limits your client is.

### Migrating to the new endpoint

Migrating to the new endpoint requires the following changes:

1. Change the hostname and base path from `https://api.defiscore.io/v0` to `https://data.api.codefi.network/v0/defi-score`
1. Add an `Authorization` header to your requests containing your bearer token
