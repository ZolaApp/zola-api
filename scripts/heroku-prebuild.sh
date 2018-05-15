#!/bin/bash
npm install
npx babel-cli ./src --out-dir ./dist --ignore spec.js,tests
