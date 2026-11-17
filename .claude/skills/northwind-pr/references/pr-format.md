# Northwind PR format: house rules

Load this when filling in `assets/pr-body.md`.

## Title

`<TICKET-ID>: <what it does>`

- The ticket ID comes from the branch name or the ticket file, uppercase: `NWP-101`.
- "What it does" is a lowercase verb phrase saying what the app can now do: `NWP-101: add export options`, `NWP-201: issue virtual cards`.
- At most 72 characters. No trailing period, no emoji, no "WIP".

## What changed

- **One paragraph**, three to five sentences, in plain language.
- Say what a user or operator can do now that they could not before, then the one or two design choices a reviewer needs to know about (for example "column names are validated on the server against an allowlist").
- **Not a file list.** The diff already is one. Name a file only when the reviewer needs to know where a decision lives.
- No "implemented … functionality", no "this PR …", no marketing.

## How I verified it

See `verification.md`. In short: a bullet per step, each with the exact command or action and what came out, quoted.

## Acceptance criteria

- Copy every checkbox from the ticket **verbatim**, in the ticket's order. Do not reword, merge or drop any.
- `[x]` only for a criterion met in the code on this branch.
- A partial criterion stays `[ ]` and gets an indented note: `- Partial: <what is done>; <what is missing>.`
- An unmet criterion stays `[ ]` with a one-line reason.
- A caveat on a met criterion (an edge case, a judgment call) goes on an indented `- Note:` line.

## Deliberately not done

- Everything in the ticket's out-of-scope list that was respected, plus anything you chose to leave out, each with a reason: "out of scope per ticket", "follow-up: NWP-xxx", "found during the work, not this ticket's job".
- Bugs noticed but not fixed: name the file and the root cause, not just the symptom.
- Unrelated commits riding on the branch: name them so the reviewer is not surprised.
- If there truly is nothing, write `Nothing.`; never leave the section out.

## Style

- Short paragraphs, real bullets, no emoji, no filler, no summary of the summary.
- Code, paths, commands and output in backticks or fenced blocks.
