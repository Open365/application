#!/bin/bash
set -e
set -u
THISDIR="$(cd "$(dirname "$0")" && pwd)"
"$THISDIR"/src/eyeos-application.js
