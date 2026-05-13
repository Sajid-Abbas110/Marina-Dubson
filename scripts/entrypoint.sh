#!/bin/sh

echo "Resolving any failed migrations..."
node node_modules/prisma/build/index.js migrate resolve --rolled-back 20260513000000_init 2>&1 || true

echo "Running database migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Starting application..."
exec node server.js
