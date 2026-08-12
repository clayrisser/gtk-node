.POSIX:
export ROOTDIR ?= $(eval ROOTDIR := $(shell git rev-parse --show-toplevel))$(ROOTDIR)
include $(ROOTDIR)/make.mk

.DEFAULT_GOAL := build

ASDF_VERSION ?= v0.18.0
.PHONY: prepare prepare/asdf prepare/cloc prepare/gtk
prepare: sudo
	@command -v asdf >/dev/null 2>&1 || $(MAKE) prepare/asdf
	@command -v cloc >/dev/null 2>&1 || $(MAKE) prepare/cloc
	@pkg-config --exists gtk+-3.0 2>/dev/null || $(MAKE) prepare/gtk
	@awk '!/^#/ && NF {print $$1}' .tool-versions | \
		while read t; do asdf plugin add "$$t" 2>/dev/null || true; done
	@rcfile=$$(mktemp); \
		{ asdf install 2>&1; echo $$? >$$rcfile; } | grep --line-buffered -v 'is already installed' || true; \
		rc=$$(cat $$rcfile); rm -f $$rcfile; exit $$rc
	@$(PNPM) install
prepare/asdf:
	@command -v brew >/dev/null 2>&1 && brew install asdf || { \
		o=$$(uname | tr A-Z a-z); a=$$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/'); \
		curl -fsSL "https://github.com/asdf-vm/asdf/releases/download/$(ASDF_VERSION)/asdf-$(ASDF_VERSION)-$$o-$$a.tar.gz" \
			| $(SUDO) tar -xz -C /usr/local/bin asdf; \
	}
prepare/cloc:
	@$(PKG_INSTALL) cloc
prepare/gtk:
	@$(PKG_INSTALL) $(GTK_PACKAGE)

# asdf is deliberately absent: the container image installs the same toolchain
# from apt, so gating on asdf would make `make build` unrunnable in docker.
.PHONY: configure
configure:
	@for cmd in node $(PNPM) $(CLOC) $(BATS) $(SHFMT); do \
		command -v $$cmd >/dev/null 2>&1 || { echo "$$cmd is missing, run \`make prepare\`"; exit 1; }; \
	done

.PHONY: deps ~deps
~deps: node_modules/.modules.yaml
node_modules/.modules.yaml: pnpm-lock.yaml package.json
	@$(MAKE) deps
deps: FORCE
	@$(PNPM) install

# node-gyp `rebuild` is clean+configure+build with no incremental mode, so the
# artifact marker is what keeps a warm `make test` from recompiling GTK every
# time. app.so stands in for all three targets — they share one binding.gyp.
.PHONY: build ~build
~build: build/Release/app.so
build/Release/app.so: binding.gyp $(shell $(GIT) ls-files 'src/*.c' 'src/*.h')
	@$(MAKE) build
build: configure ~deps FORCE
	@pkg-config --exists gtk+-3.0 2>/dev/null || { \
		echo "gtk+-3.0 development headers not found — run \`make prepare\`, or build in the container with \`make docker/run/build\`"; \
		exit 1; }
	@$(NODE_GYP) rebuild

.PHONY: test
test: test/integration

# No unit tier: every line in src/ is FFI glue over the C libraries, so there
# is nothing meaningful to exercise without loading them.
.PHONY: test/integration
test/integration: configure ~build
	@mkdir -p coverage
	@$(XVFB_RUN) node --test --experimental-test-coverage \
		--test-reporter=spec --test-reporter-destination=stdout \
		--test-reporter=lcov --test-reporter-destination=coverage/lcov.info tests/*.test.js

.PHONY: test/e2e
test/e2e: configure
	@cd tests && export PROJECT_ROOT=$(ROOTDIR) && \
		trap './teardown.sh' EXIT INT TERM; \
		./setup.sh && $(BATS) .

# Shared (used by both format and lint). Guarded because shfmt falls back to
# reading stdin when handed an empty argument list.
SHFILES := $(shell $(GIT) ls-files '*.sh' '*.bats')

.PHONY: format
format: configure ~deps
	@$(OXFMT) .
	@[ -z "$(SHFILES)" ] || $(SHFMT) -w $(SHFILES)

.PHONY: lint
lint: configure ~deps
	@$(OXLINT)
	@[ -z "$(SHFILES)" ] || $(SHFMT) -d $(SHFILES)

.PHONY: count
count: configure
	@$(CLOC) $(shell $(GIT) ls-files)

.PHONY: clean
clean:
	@rm -rf build coverage $(MAKEDIR)

.PHONY: purge
purge: clean
	@$(GIT) clean -fxd

.PHONY: docker docker/%
docker: FORCE
	@$(MAKE) -C docker
docker/%: FORCE
	@$(MAKE) -C docker $*
