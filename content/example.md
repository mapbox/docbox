## Scores

The `scores` resource is available at this location:

Environment | Location
--- | ---
Production | `https://api.defiscore.io/v0/scores`

A _score_ contains fields relating to an _asset_ by a _platform_.
The `scores` resource is computed every `6` hours and is cached at `1` hour.
The shape of `scores` will grow or shrink depending on the fields that need to be exposed.

We make use of HTTP status codes to communicate the result of the request. These status codes are currently supported:

Status Code | Description
--- | ---
`200` | The response was successful and there scores present.
`400` | The request was invalid and did not map to our requirements.
`404` | The resource that was requested was not found.

We try to keep the responses minimal, only serving the most important bits to keep response sizes small.
The fields of a _score_ are defined as follows:

Field | Description
--- | ---
`id` | This is UUID corresponding to the batch of scores.
`createdOn` | This is the ISO formatted date the scores were computed.
`asset` | This is the string name of asset, usually referred to as the ticker.
`platform` | This is the string name of the platform.
`score` | This is the number value of computed score for the asset on the platform.
`liquidityIndex` | This is the number value representative of the liquidity value.
`collateralIndex` | This is the number value representative of the collateral value.

#### Score shape

```json
{
  "asset": "string",
  "platform": "string",
  "metrics": {
    "score": "number",
    "liquidityIndex": "number",
    "collateralIndex": "number"
  }
}
```

### List All Scores

Lists all current scores from the latest calcuation.

```endpoint
GET /v0/scores
```

#### Example request

```curl
$ curl -X GET https://api.defiscore.io/v0/scores
```

#### Example response

```json
[
  {
    "asset": "{asset}",
    "platform": "{platform}",
    "metrics": {
      "score": "{score}",
      "liquidityIndex": "{liquidityIndex}",
      "collateralIndex": "{collateralIndex}"
    }
  },
  ...
]
```

### List By Platform

List scores by a given platform.

These are the following supported platform strings:

Platform | Description
---|---
`compound` | https://compound.finance
`dydx` | https://dydx.exchange
`ddex` | https://ddex.io
`fulcrum` | https://fulcrum.trade 
`nuo` | https://nuo.network

```endpoint
GET /v0/scores?groupByPlatform={platform}
```

#### Example request

```curl
curl -X GET https://api.defiscore.io/v0/scores?groupByPlatform={platform}
```

#### Example response

```json
[
  {
    "asset": "{asset}",
    "platform": "{platform}",
    "metrics": {
      "score": "{score}",
      "liquidityIndex": "{liquidityIndex}",
      "collateralIndex": "{collateralIndex}"
    }
  },
  ...
]
```

### List By Asset

List scores by a given asset.

These are the following supported asset strings:

Asset | Descriptions
--- | ---
`eth` | https://ethereum.org
`dai` | https://makerdao.com
`sai` | https://makerdao.com
`usdc` | https://www.coinbase.com/usdc
`wbtc` | https://www.wbtc.network
`rep` | https://www.augur.net
`zrx` | https://0x.org
`bat` | https://basicattentiontoken.org
`tusd` | https://www.trusttoken.com/trueusd
`usdt` | https://tether.to

```endpoint
GET /v0/scores?groupByAsset={asset}
```

#### Example request

```curl
curl -X GET https://api.defiscore.io/v0/scores?groupByAsset={asset}
```

#### Example response

```json
[
  {
    "asset": "{asset}",
    "platform": "{platform}",
    "metrics": {
      "score": "{score}",
      "liquidityIndex": "{liquidityIndex}",
      "collateralIndex": "{collateralIndex}"
    }
  },
  ...
]
```

### Asset Of Platform

Retrieve the score of a single asset of a platform, if platform supports it.
Simply combining both query parameters allow you to isolate a certain score.
Refer to the tables above for supported assets and platforms.

```endpoint
GET /v0/scores?groupByAsset={asset}&groupByPlatform={platform}
```

#### Example request

```curl
curl https://api.defiscore.io/v0/scores?groupByAsset={asset}&groupByPlatform={platform}
```

#### Example response

```json
[
  {
    "asset": "{asset}",
    "platform": "{platform}",
    "metrics": {
      "score": "{score}",
      "liquidityIndex": "{liquidityIndex}",
      "collateralIndex": "{collateralIndex}"
    }
  },
  ...
]
```
