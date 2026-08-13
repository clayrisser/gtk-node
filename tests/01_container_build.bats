#!/usr/bin/env bats
load helper.sh

@test "the C libraries compile from a clean checkout in the container" {
	run dc run --rm gtk-node make build
	[ "$status" -eq 0 ]
	run dc run --rm gtk-node ls build/Release/app.so build/Release/button.so build/Release/window.so
	[ "$status" -eq 0 ]
}

@test "the built libraries load and instantiate GTK widgets headlessly" {
	run dc run --rm gtk-node make test/integration
	[ "$status" -eq 0 ]
	# Guards against the runner exiting 0 because it matched no test files.
	echo "$output" | grep -q 'App wraps a live GtkApplication'
	echo "$output" | grep -q 'fail 0'
}
