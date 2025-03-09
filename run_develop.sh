#!/bin/bash

(
  npm run develop
) & (
  npm run serve
)

# Wait for all background processes to complete.
wait
