#!/bin/bash

npx babel ./src --out-dir ./dist --ignore spec.js,tests && node dist/index.js
