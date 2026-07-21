#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORBIT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=== Orbit Consumer Fixture ==="

echo "1. Building Orbit Core..."
cd "$ORBIT_ROOT"
npx ng build orbit --configuration production

echo "2. Packing tarball..."
cd "$ORBIT_ROOT/dist/orbit-new"
TARBALL=$(npm pack 2>/dev/null | tail -1)
cp "$TARBALL" /tmp/galileo-orbit-0.1.0.tgz

echo "3. Installing in consumer fixture..."
cd "$SCRIPT_DIR"
rm -rf node_modules package-lock.json
npm install @galileo/orbit@file:/tmp/galileo-orbit-0.1.0.tgz 2>&1 | tail -3

echo "4. Building consumer fixture..."
npx ng build

echo ""
echo "=== Consumer fixture OK ==="
echo "All Orbit components imported and built successfully."
