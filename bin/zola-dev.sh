#!/usr/bin/env bash
set -e

nodemon --exec npx babel-node -- src/index.js
