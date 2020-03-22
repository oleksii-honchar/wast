#!/usr/bin/env bash
envFile="$PWD/configs/envs/local.env"
npx env-cmd -f $envFile "$PWD/devops/local/scripts/check-env-vars.sh"

source $envFile

npx env-cmd -f $envFile \
    node --inspect-brk node_modules/webpack/bin/webpack.js \
        --config ./configs/webpack.config.js \
        --mode development \
        --env.BUILD_ANALYZE=$BUILD_ANALYZE
