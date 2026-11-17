#!/usr/bin/env bash
# Prints the facts a PR description is built from, so they are read rather than recalled.
# Usage: changed_files.sh [base-ref]   (default: first of upstream/main, origin/main, main that exists)
# Works from any directory inside the repository or a worktree of it.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

base="${1:-}"
if [[ -z "$base" ]]; then
  # Remote refs first: a local main that is never pulled makes an old merge-base
  # and drags already-merged upstream commits into the description.
  for candidate in upstream/main origin/main main; do
    if git rev-parse --verify --quiet "$candidate" >/dev/null; then base="$candidate"; break; fi
  done
fi
[[ -n "$base" ]] || { echo "error: no base branch found; pass one, e.g. changed_files.sh origin/main" >&2; exit 1; }

branch="$(git branch --show-current)"
ticket="$(grep -oiE '(^|[^A-Za-z])NWP-[0-9]+' <<<"$branch" | grep -oiE 'NWP-[0-9]+' | head -1 | tr '[:lower:]' '[:upper:]' || true)"
merge_base="$(git merge-base "$base" HEAD)"

echo "branch:     $branch"
echo "base:       $base ($(git rev-parse --short "$merge_base"))"
echo "repo root:  $(pwd)"
echo "body path:  $(git rev-parse --absolute-git-dir)/${ticket:-PR}-pr-body.md"
if [[ -f .github/pull_request_template.md ]]; then
  echo "template:   .github/pull_request_template.md (keep every heading)"
fi
if [[ -n "$ticket" && -f "docs/tickets/$ticket.md" ]]; then
  echo "ticket:     $ticket (docs/tickets/$ticket.md)"
elif [[ -n "$ticket" ]]; then
  echo "ticket:     $ticket (no docs/tickets/$ticket.md found)"
else
  echo "ticket:     none found in branch name"
fi

echo; echo "== commits ($base..HEAD)"
git log --oneline --no-decorate "$merge_base"..HEAD

echo; echo "== diffstat"
git diff --stat "$merge_base"...HEAD | tail -n 50

echo; echo "== files by status (A added, M modified, D deleted, R renamed)"
git diff --name-status "$merge_base"...HEAD

echo; echo "== test files touched"
git diff --name-only "$merge_base"...HEAD | grep -E '\.(test|spec)\.[jt]sx?$' || echo "(none)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo; echo "== WARNING: uncommitted changes (not part of the PR until committed)"
  git status --short
fi
