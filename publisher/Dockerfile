FROM node:18-alpine


#
# Build 
#

RUN npm install -g pnpm@8.6

WORKDIR /app

COPY package.json .
COPY pnpm-*.yaml .
RUN pnpm fetch --ignore-scripts

COPY publisher/package.json publisher/
RUN pnpm install --offline --frozen-lockfile

COPY tsconfig* .
COPY publisher/tsconfig* publisher/
COPY publisher/src/ publisher/src

RUN pnpm run --filter @self-workerd/publisher build

#
# Build final image
#

FROM node:18-alpine
ENV NODE_ENV=production
RUN npm install -g pnpm@8.6

WORKDIR /app

COPY --from=0 /app/package.json .
COPY --from=0 /app/pnpm-*.yaml .
COPY --from=0 /app/publisher/package.json publisher/

RUN pnpm install --frozen-lockfile --prod
COPY publisher/config.template.capnp publisher/
COPY --from=0 /app/publisher/dist/ publisher/dist

WORKDIR /app/publisher

EXPOSE 3000
ENTRYPOINT [ "pnpm", "start" ]
