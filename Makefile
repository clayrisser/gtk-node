SHELL := /bin/bash
CWD := $(shell pwd)

.PHONY: all
all: clean build

.PHONY: build
build: src/clib/window.so src/clib/app.so node_modules/node-gtk3
	@npm run build
	@echo built

node_modules/node-gtk3:
	@ln -s $(CWD) $(CWD)/node_modules/node-gtk3

.PHONY: start
start: clean build
	@node ./lib/node-gtk3.min.js

src/clib/window.so:
	@mkdir -p ./lib/clib/
	@gcc ./src/clib/window.c -o ./lib/clib/window.so -Wall -g -shared -fpic `pkg-config --cflags --libs gtk+-3.0`

src/clib/app.so:
	@mkdir -p ./lib/clib/
	@gcc ./src/clib/app.c -o ./lib/clib/app.so -Wall -g -shared -fpic `pkg-config --cflags --libs gtk+-3.0`

.PHONY: clean
clean:
	-@rm -rf ./src/clib/*.so ./lib ./node_modules/node-gtk3
	@echo cleaned
