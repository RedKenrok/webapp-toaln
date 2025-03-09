#!/bin/bash

(npm run build)
if [ $? -ne 0 ]; then
  echo "Failed to build."
  exit 1
fi

echo "Build commands executed successfully."
