.POSIX:
ROOTDIR ?= $(eval ROOTDIR := $(shell git rev-parse --show-toplevel))$(ROOTDIR)
include $(ROOTDIR)/make.mk

.DEFAULT_GOAL := bake

# Exported because docker-bake.hcl reads it as a shell environment variable.
export BAKE_OUTPUT ?= docker
BAKE_ARGS ?= -f $(ROOTDIR)/docker/docker-bake.hcl --pull --provenance=false --allow=fs.read=..
ifeq (registry,$(BAKE_OUTPUT))
BAKE_ARGS += --set '*.platform=linux/amd64,linux/arm64' --push
else
BAKE_ARGS += --load
endif

.PHONY: bake bake/%
bake: $(ROOTDIR)/.dockerignore
	@[ "$(BAKE_OUTPUT)" != registry ] || case "$(GIT_COMMIT)" in *-dirty) echo "refusing to push from dirty tree (GIT_COMMIT=$(GIT_COMMIT)) — commit first" >&2; exit 1;; esac
	@$(BUILDX) bake $(BAKE_ARGS)
bake/%: $(ROOTDIR)/.dockerignore
	@[ "$(BAKE_OUTPUT)" != registry ] || case "$(GIT_COMMIT)" in *-dirty) echo "refusing to push from dirty tree (GIT_COMMIT=$(GIT_COMMIT)) — commit first" >&2; exit 1;; esac
	@$(BUILDX) bake $(BAKE_ARGS) $*

$(ROOTDIR)/.dockerignore: $(ROOTDIR)/.gitignore
	@cp "$<" "$@"

# No up/logs/ps: this image is a one-shot build environment, not a service.
COMPOSE_ARGS ?= -f $(ROOTDIR)/docker/compose.yaml

.PHONY: run/% shell down
run/%: bake
	@$(COMPOSE) $(COMPOSE_ARGS) run --rm gtk-node make $*
shell: bake
	@$(COMPOSE) $(COMPOSE_ARGS) run --rm gtk-node bash
down:
	@$(COMPOSE) $(COMPOSE_ARGS) down --volumes --remove-orphans
