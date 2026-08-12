#!/bin/sh
set -e
. "$(dirname -- "$0")/helper.sh"

if [ -n "$KEEP_STACK" ]; then
	echo "KEEP_STACK set, leaving the $COMPOSE_PROJECT_NAME volumes in place"
	exit 0
fi
dc down --volumes --remove-orphans
