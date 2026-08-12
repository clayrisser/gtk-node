ARG NODE_VERSION
FROM node:${NODE_VERSION}-bookworm-slim

ARG PNPM_VERSION

# build-essential/python3/pkg-config/libgtk-3-dev are what node-gyp needs to
# compile the C libraries. xvfb+xauth give GTK an X display so the tests can
# instantiate real widgets headlessly. bats/cloc/shfmt satisfy `make configure`,
# which is a prerequisite of build and test.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		bats \
		build-essential \
		ca-certificates \
		cloc \
		git \
		libgtk-3-dev \
		pkg-config \
		python3 \
		shfmt \
		xauth \
		xvfb \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm install --global pnpm@${PNPM_VERSION}

# node_modules is a named volume, so a store outside it lands on a different
# filesystem; pnpm then relocates the store next to the project, which means
# into the bind-mounted checkout. Keep it inside the volume instead.
ENV NPM_CONFIG_STORE_DIR=/workspace/node_modules/.pnpm-store

WORKDIR /workspace

CMD ["make", "test"]
