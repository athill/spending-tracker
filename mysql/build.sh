#!/bin/bash

SCRIPT_RELATIVE_DIR=$(dirname "${BASH_SOURCE[0]}")

docker build -t spending-db $SCRIPT_RELATIVE_DIR
