---
name: northwind-pr
description: Write a Northwind pull request description for the current branch in the team format (ticket-ID title, what changed, how I verified it, acceptance criteria, deliberately not done), built from the branch diff, git log and the ticket in docs/tickets/. Use when the user asks for a Northwind or team-format PR description, a PR write-up for an NWP ticket, or invokes /northwind-pr. Writes the description only; it never pushes or opens the PR.
---

# /northwind-pr

Write the pull request description for this branch in the Northwind team format. The reviewer reads it before the diff, so it has to be true, short, and checkable.

## Steps

1. **Collect the facts. Write nothing yet.**
   - Run `bash .claude/skills/northwind-pr/scripts/changed_files.sh`. It prints the base, the ticket ID it found in the branch name, the commits, the diffstat and the changed files. If it reports no ticket ID, ask the user which ticket this is.
   - Read the diff itself (`git diff <base>...HEAD`), not just the stat.
   - Read the ticket at `docs/tickets/<TICKET-ID>.md` in full: description, acceptance criteria, notes, definition of done. If a spec exists in `docs/specs/`, read it too.

2. **Check each acceptance criterion against the code.** For each checkbox in the ticket, find the code that meets it, or find that nothing does. Mark it met, partial (say which part is missing), or not met.

3. **Gather the verification evidence.** Read `references/verification.md` before writing that section. Only steps that actually ran, in this session or now, go in.

4. **Fill in the template.** Copy `assets/pr-body.md`, follow the house rules in `references/pr-format.md`, and replace every placeholder. Leave no `<...>` behind.

5. **Hand it over.** Print the title and body, and save the body to `.git/<TICKET-ID>-pr-body.md` so it never shows up in the diff. Offer the `gh pr create` command, but do not run it, push, or open the PR unless the user asks.

## Hard rules

- **Never claim a verification step that did not run.** If a step was not run, say "Not run" or leave it out. A gap stated plainly is acceptable; an invented one is not.
- **Never tick an acceptance criterion because it was intended.** Only because you found the code that meets it.
- Quote command output exactly, trimmed if needed but never edited.
