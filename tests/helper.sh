# Shared helpers for the bats e2e suite. POSIX sh.
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "${BATS_TEST_DIRNAME:-${BATS_SUITE_DIRNAME:-$(dirname -- "$0")}}/.." && pwd)}"
COMPOSE_FILE="$PROJECT_ROOT/docker/compose.yaml"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-gtk-node-test}"
export COMPOSE_PROJECT_NAME

dc() {
	docker compose -f "$COMPOSE_FILE" --project-name "$COMPOSE_PROJECT_NAME" "$@"
}
