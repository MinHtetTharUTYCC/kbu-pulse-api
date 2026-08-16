#!/bin/sh
set -e

echo "Pushing database schema..."
npx prisma db push

echo "Starting the application..."
exec node dist/src/main
