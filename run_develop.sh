#!/bin/bash

(
  npm run develop:scripts
) & (
  npm run develop:styles
) & (
  npm run serve
)

# Wait for all background processes to complete.
wait
