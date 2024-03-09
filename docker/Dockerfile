# 1. Install production dependencies
FROM node:20.11.1-alpine3.19 AS dependencies
WORKDIR /dependencies
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --production --non-interactive && \
  yarn cache clean

# 2. Build
FROM dependencies AS build
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive && \ 
  yarn cache clean
COPY . .
RUN yarn build

# 3. Final application image
FROM node:20.11.1-alpine3.19 as app
WORKDIR /app
COPY --from=build /build/dist dist
COPY --from=dependencies /dependencies/node_modules node_modules
COPY package.json ./
USER node
ENV NODE_ENV docker
ENTRYPOINT [ "node" ]
CMD ["dist/main.js"]
