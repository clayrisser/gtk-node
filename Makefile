SHELL := /bin/bash
CWD := $(shell pwd)
CFLAGS := -Wall -g -shared -fpic `pkg-config --cflags --libs gtk+-3.0`
UNAME := $(shell uname)
ifeq ($(UNAME),Darwin)
	SOEXT := dylib
else
	SOEXT := so
endif

TARGETS := $(shell find ./src/clib -name '*.c' -print | sed -e 's/\.c/\.$(SOEXT)/; s/^\.\/src/.\/lib/')

.PHONY: all
all: clean build

.PHONY: build
build: lib/bindings $(TARGETS)
	@echo ::: Built :::

lib/bindings:
	@echo Building: lib/bindings
	@npm run build

lib/clib/%.$(SOEXT): src/clib/%.c src/clib/%.h
	@echo Building: $@
	@mkdir -p $(CWD)/lib/clib/
	@$(CC) $< -o $@ $(CFLAGS)

.PHONY: demo
demo: build
	@npm run demo

.PHONY: clean
clean:
	@npm run clean
	@echo ::: Cleaned :::
