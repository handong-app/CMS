#!/bin/bash

set -e

if [ "$REACT_BUILD" != "1" ]; then
  echo "[INFO] REACT_BUILD is not set to 1, skipping React build."
  exit 0
fi

FRONTEND_DIR="src/main/front"
BUILD_OUTPUT_DIR="$FRONTEND_DIR/dist"
STATIC_DIR="src/main/resources/static"

echo "[INFO] Installing dependencies..."
npm --prefix "$FRONTEND_DIR" install

echo "[INFO] Building React..."
npm --prefix "$FRONTEND_DIR" run build

echo "[INFO] Copying build to Spring Boot static/ directory..."
mkdir -p "$STATIC_DIR"
rm -rf "$STATIC_DIR"/*
cp -r "$BUILD_OUTPUT_DIR"/* "$STATIC_DIR"
