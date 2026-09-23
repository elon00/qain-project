#!/usr/bin/env bash
set -euo pipefail

: "${COLOSSEUM_COPILOT_API_BASE:=https://copilot.colosseum.com/api/v1}"

if [[ -z "${COLOSSEUM_COPILOT_PAT:-}" ]]; then
  echo "COLOSSEUM_COPILOT_PAT is not set."
  echo "Export your active Colosseum Copilot token before running this script."
  exit 2
fi

echo "Verifying Colosseum Copilot authentication..."
curl --fail --silent --show-error   "${COLOSSEUM_COPILOT_API_BASE}/status"   -H "Authorization: Bearer ${COLOSSEUM_COPILOT_PAT}" >/dev/null

echo "Installing Colosseum Copilot skill..."
npx --yes skills add ColosseumOrg/colosseum-copilot

echo "Colosseum Copilot is installed and the token is valid."
