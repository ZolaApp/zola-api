#!/bin/bash

npx babel-cli ./src --out-dir ./dist --ignore spec.js,tests && node dist/index.js
