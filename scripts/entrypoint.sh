#!/bin/sh

echo "Starting Marina Dubson CRM..."
echo "Working directory: $(pwd)"
echo "Node version: $(node --version)"
echo "Checking prisma..."
ls -la node_modules/prisma/build/index.js 2>&1 || echo "prisma build/index.js NOT FOUND"
ls -la node_modules/@prisma/client 2>&1 || echo "@prisma/client NOT FOUND"
echo "DATABASE_URL set: $(test -n "$DATABASE_URL" && echo YES || echo NO)"

echo "Running database migrations..."
node node_modules/prisma/build/index.js migrate deploy 2>&1 || echo "MIGRATION FAILED with exit code $?"

echo "Starting application..."
exec node server.js
