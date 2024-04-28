#!/bin/sh
echo "Checking ENV"

# Find and replace BAKED values with Real values
find /app/public /app/.next -type f -name "*.js" |
    while read file; do
        sed -i "s|BAKED_API_URL|$API_URL|g" "$file"
    done

# Start the app
npm start
