SHELL := /bin/bash
CWD := $(shell pwd)
CFLAGS := -Wall -g -shared -fpic `pkg-config --cflags --libs gtk+-3.0`

UNAME := $(shell uname)
ifeq ($(UNAME),Darwin)
	SOEXT := dylib
else
	SOEXT := .so
endif

TARGETS := $(shell find ./src/clib -name '*.c' -print | sed -e 's/\.c/\.$(SOEXT)/; s/^\.\/src/.\/lib/')

.PHONY: all
all: clean build

.PHONY: build
build: $(TARGETS) node_modules/node-gtk3
	@npm run build
	@echo built

lib/clib/%.$(SOEXT): src/clib/%.c src/clib/%.h
	@echo "Building: $@"
	@mkdir -p ./lib/clib/
	@$(CC) $< -o $@ $(CFLAGS)

node_modules/node-gtk3:
	@ln -s $(CWD) $(CWD)/node_modules/node-gtk3

.PHONY: start
start: clean build
	@node ./lib/node-gtk3.min.js

.PHONY: clean
clean:
	-@rm -rf ./lib ./node_modules/node-gtk3
	@echo cleaned
