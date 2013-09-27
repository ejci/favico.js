
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

define release
	VERSION=`node -pe "require('./bower.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		['./bower.json', './package.json'].forEach(function (file) {\
			var j = require(file);\
			j.version = \"$$NEXT_VERSION\";\
			var s = JSON.stringify(j, null, 2);\
			require('fs').writeFileSync(file, s);\
		});\
	" && \
	git rm favico-*.min.js && \
	make build && \
	git add favico-*.min.js bower.json package.json && \
	git commit -m "release $$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION" -m "release $$NEXT_VERSION"
endef

release-patch: lint
	@$(call release,patch)

release-minor: lint
	@$(call release,minor)

release-major: lint
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	# todo: bower/npm publish

.PHONY: clean lint build
