## Overview
[The DeFi Score](https://defiscore.io/) is a framework for evaluating DeFi protocols. Based on factors including smart contract risk, collateralization, and liquidity, the model outputs an easy to understand 0–10 rating.

With the **DeFi Score API**, developers can programmatically retrieve the individual scores and additional data points which can then be presented to users or integrated into other systems.

Scoring decentralized lending platforms is a continuous process that depends on many variables.
This API will conveniently provide scores and metrics of every supported asset and platform.
As new data comes online and our model grows, we will introduce new API endpoints allowing for
different views of the scores over time and with different parameters.

The API is in an alpha state as we understand the usage statistics and the preferences of our clients.
We will make changes accordingly to the feedback until we must respect backwards compatibility.

## Service

<img src="https://img.shields.io/badge/version-0.0.6-blue"
     alt="Version Badge"
     style="margin-left:0" />

The DeFi Score API is currently live at this location:

Environment | URL
--- | ---
Production | `https://api.defiscore.io/v0`

Breaking changes are assumed at `v0` so there is no need for a staging environment.
However, once `v1` is available, a staging environment will be stood up to test future modules and interfaces.
