#!/usr/bin/env bash
set -euo pipefail

: "${COLOSSEUM_COPILOT_API_BASE:=https://copilot.colosseum.com/api/v1}"

COLOSSEUM_COPILOT_REPO="https://github.com/ColosseumOrg/colosseum-copilot.git"
COLOSSEUM_COPILOT_COMMIT="11a0e47ce47ed310003161b5fcb26e18bfc0ac80"
SKILLS_CLI_VERSION="1.7.0"

if [[ -z "${COLOSSEUM_COPILOT_PAT:-}" ]]; then
  echo "COLOSSEUM_COPILOT_PAT is not set."
  echo "Export your active Colosseum Copilot token before running this script."
  exit 2
fi

tmp_root="$(mktemp -d)"
curl_cfg="$tmp_root/curl.conf"
repo_dir="$tmp_root/colosseum-copilot"

cleanup() {
  rm -rf "$tmp_root"
}
trap cleanup EXIT

umask 077
cat >"$curl_cfg" <<EOF
fail
silent
show-error
url = "${COLOSSEUM_COPILOT_API_BASE}/status"
header = "Authorization: Bearer ${COLOSSEUM_COPILOT_PAT}"
EOF

echo "Verifying Colosseum Copilot authentication..."
curl --config "$curl_cfg" >/dev/null

echo "Fetching pinned Colosseum Copilot source..."
git init -q "$repo_dir"
git -C "$repo_dir" remote add origin "$COLOSSEUM_COPILOT_REPO"
git -C "$repo_dir" fetch -q --depth 1 origin "$COLOSSEUM_COPILOT_COMMIT"
git -C "$repo_dir" checkout -q --detach FETCH_HEAD
test "$(git -C "$repo_dir" rev-parse HEAD)" = "$COLOSSEUM_COPILOT_COMMIT"

echo "Installing pinned Colosseum Copilot skill for Codex and Claude Code..."
npx --yes "skills@${SKILLS_CLI_VERSION}" add "$repo_dir" -a codex -a claude-code -y

echo "Colosseum Copilot is installed from pinned commit $COLOSSEUM_COPILOT_COMMIT and the token is valid."
