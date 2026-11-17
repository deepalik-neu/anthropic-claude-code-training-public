# Writing "How I verified it"

Read this before writing that section. It is the section reviewers trust least and check most.

## What counts as evidence

A step goes in only if **one** of these is true:

1. **It ran in this session**, and its output is in the conversation. Quote that output.
2. **You run it now**, read-only, to get real output: `npm test`, `npx tsc --noEmit`, `npm run lint`, `git` commands, `curl` against a dev server that is already running. Say it was run while writing the description.

Anything else is **not evidence**: what the user probably did, what CI will do, what "should" pass, a test you wrote but did not run.

## How to write each step

- One bullet per step: the exact command or action, then what came out.
- Test runs: paste the summary lines verbatim, e.g. `Tests  36 passed (36)`. Give the before and after counts if both are known.
- HTTP checks: the request and the status, plus the one detail that proves the point (a header, a row count, an error message).
- Browser checks: say **who** did it. "I clicked …" only if the user told you they did. An automated Playwright or MCP run is described as automated, with what it asserted.
- Failures and skips are evidence too. Say "`npm test`: 1 failed (csv.test.ts › …)", not "tests mostly pass".

## When something was not checked

- Write it plainly: `Not run: did not open the downloaded file in a spreadsheet.`
- If the team template has a checkbox for it (for example "Checked it in the browser"), leave it unticked.
- Never fill the gap with a guess, a plausible number, or "verified manually".

## Before you hand it over

Re-read every bullet in this section and point to where its output came from. If you cannot, delete the bullet or turn it into a "Not run" line.
