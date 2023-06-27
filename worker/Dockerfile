FROM node:18-slim


#
# Build 
#

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qy libc++1 && \
    apt-get clean

RUN npm install -g pnpm@8.6

WORKDIR /app

COPY package.json .
COPY pnpm-*.yaml .
RUN pnpm fetch

# COPY workerd to root
RUN find node_modules/ -wholename "*cloudflare/workerd*/bin/workerd*" -type f | xargs cp -t .

COPY worker/package.json worker/
RUN pnpm install --offline --frozen-lockfile

COPY tsconfig* .
COPY worker/tsconfig* worker/
COPY worker/src/ worker/src
COPY worker/tasks/ worker/tasks

RUN pnpm run --filter @self-workerd/worker build


#
# Build final image
#
FROM debian:12-slim
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qy libc++1 curl unzip && \
    apt-get clean

WORKDIR /app

COPY worker/entrypoint.sh .
COPY --from=0 /app/worker/dist config
COPY --from=0 /app/workerd .

EXPOSE 3000

ENV PUBLISHER_ENDPOINT http://host.docker.internal:3001
ENTRYPOINT [ "./entrypoint.sh" ]
