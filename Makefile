SHELL := /bin/bash
CWD := $(shell pwd)
CFLAGS := -Wall -g -shared -fpic `pkg-config --cflags --libs gtk+-3.0`
UNAME := $(shell uname)
ifeq ($(UNAME),Darwin)
	SOEXT := dylib
else
	SOEXT := so
endif

TARGETS := $(shell find ./src/ -name '*.c' -print | sed -e 's/\.c/\.$(SOEXT)/; s/^\.\/src/.\/lib/')

.PHONY: all
all: clean build

.PHONY: build
build: lib $(TARGETS)
	@echo ::: Built :::

lib:
	@echo Building: lib
	@npm run build

lib/%.$(SOEXT): src/%.c src/%.h
	@echo Building: $@
	$(eval LIBPATH := $(shell echo $@ | sed -e 's/\/[^\//]*\.$(SOEXT)//g'))
	@mkdir -p $(LIBPATH)
	@$(CC) $< -o $@ $(CFLAGS)

.PHONY: demo
demo: build
	@npm run demo

.PHONY: clean
clean:
	@npm run clean
	@echo ::: Cleaned :::
