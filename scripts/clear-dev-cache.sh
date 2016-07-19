#!/bin/bash

set -x

rm -rf $TMPDIR/react-*
which watchman > /dev/null && watchman watch-del-all
