#!/usr/bin/env bash
set -e

nodemon --exec npm run babel-node -- src/index.js
