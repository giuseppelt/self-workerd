#!/bin/bash


if [[ $# -gt 0 ]]; then
    # If we pass a command, run it
    exec "$@"
    exit 0
fi


curl -o config.zip $PUBLISHER_ENDPOINT/getConfig
unzip config.zip -d ./config

./workerd serve ./config/config.capnp
