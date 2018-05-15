#!/bin/bash
npm install --only=dev
npx babel-cli ./src --out-dir ./dist --ignore spec.js,tests
