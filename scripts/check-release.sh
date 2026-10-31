#!/usr/bin/env bash
# Fails if any page still has unfinished content or an unconnected form.
set -u
cd "$(dirname "$0")/.."
fail=0
if grep -n -E '\[TODO|YOUR_FORM_ID|formspree\.io' --include='*.html' -r . ; then
  echo "Release blocked: replace the items above before merging."
  fail=1
fi
if ! grep -qE 'sheetsUrl: *"https://script\.google\.com/macros/s/[^"]+/exec"' js/config.js; then
  echo "Release blocked: add the Google Sheets web app URL to js/config.js (docs/google-sheets-setup.md)."
  fail=1
fi
if LC_ALL=C.UTF-8 grep -n -P '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' --include='*.html' -r . ; then
  echo "Release blocked: remove emojis."
  fail=1
fi
for f in *.html; do
  for p in $(grep -oE '(href|src)="[^"]+"' "$f" | sed -E 's/^(href|src)="//; s/"$//; s/[#?].*$//' | grep -vE '^(https?:|mailto:|tel:|$)'); do
    [ -e "$p" ] || { echo "$f: missing file $p"; fail=1; }
  done
done
[ $fail -eq 0 ] && echo "Release check passed."
exit $fail
