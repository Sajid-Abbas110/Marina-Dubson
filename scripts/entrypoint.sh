#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" 2>/dev/null; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node server.js
