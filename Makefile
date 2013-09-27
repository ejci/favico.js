
BIN = ./node_modules/.bin

CWD := $(shell pwd)
UGLIFY = $(CWD)/node_modules/.bin/uglifyjs
JSHINT = $(CWD)/node_modules/.bin/jshint

clean:
	@rm -f favico-*.min.js

lint:
	$(JSHINT) ./favico.js

build:
	make clean
	make lint
	VERSION=`node -pe "require('./package.json').version"` && \
	$(UGLIFY) -c -m --comments 'license' favico.js > "favico-$$VERSION.min.js"


.PHONY: clean lint build
