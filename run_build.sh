#!/bin/bash

(npm run build:scripts)
if [ $? -ne 0 ]; then
  echo "Failed to build scripts."
  exit 1
fi
(npm run build:styles)
if [ $? -ne 0 ]; then
  echo "Failed to build styles."
  exit 1
fi

echo "Build commands executed successfully."
