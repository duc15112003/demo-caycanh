#!/bin/sh
set -e

if command -v mvn >/dev/null 2>&1; then
  echo "Maven already installed, skip install."
else
  echo "Maven not found, installing Maven."
  apt-get update
  apt-get install -y maven
  rm -rf /var/lib/apt/lists/*
fi

exec mvn spring-boot:run
