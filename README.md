Application Service
====================

## Overview

Service that adds/remove and get applications for the eyeOs platform

## How to use it

`GET /aplications` : List all applications available in the platform.

`POST /applications document: <AN_APP_DESCRIPTOR>`: insert an app in the platform

`DELETE /applications document: {"data":{"appName":<APP_NAME>}`: removes an app from the platform 

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ ./tests.sh
```

