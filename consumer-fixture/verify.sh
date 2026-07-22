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
TARBALL="$ORBIT_ROOT/dist/orbit-new/$(npm pack --silent)"

echo "3. Installing in consumer fixture..."
cd "$SCRIPT_DIR"
npm ci
npm install --no-save --package-lock=false "$TARBALL"

echo "4. Building consumer fixture..."
npx ng build

echo ""
echo "=== Consumer fixture OK ==="
echo "All Orbit components imported and built successfully."
