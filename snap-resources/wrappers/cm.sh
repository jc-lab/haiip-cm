#!/bin/bash

export CM_SCRIPT=$SNAP/app/entry.js

# ISSUE: cannot read mount namespace identifier of pid 1: Permission denied
# export CM_COMMAND="/snap/bin/${SNAP_INSTANCE_NAME}.cm"

export CM_COMMAND="`which node` ${CM_SCRIPT}"

node $CM_SCRIPT $*
