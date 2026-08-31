#!/bin/bash
export PATH="/root/.cargo/bin:/opt/sequencer_venv/bin:$PATH"
export VIRTUAL_ENV=/opt/sequencer_venv
export RUSTC_WRAPPER=""
cd /opt/sequencer
exec /root/.cargo/bin/cargo build --release -p starknet_transaction_prover --features stwo_proving
