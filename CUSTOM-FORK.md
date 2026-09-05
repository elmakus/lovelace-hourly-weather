# elmakus private fork

This private fork is based on upstream `main` at
`e42a9259b2fa560e6c0d315a7c745432d8fbd2c3` (2026-09-04). That upstream line
includes the native stalled forecast recovery, forecast-type resubscription,
strict numeric configuration validation, and current dependency updates.

## Custom changes retained

- Add a current-weather `TERAZ`/`Now` segment when `show_current` is enabled,
  keep forecast intervals chronological, and omit the already-started interval
  from the future timeline.
- Use the ongoing forecast interval as the current precipitation fallback when
  the weather entity has no current precipitation attributes.
- Show forecast precipitation around segment markers on the weather bar with
  configurable amount and probability font sizes.
- Adapt label spacing to the rendered card width through `ResizeObserver` while
  preserving the configured `label_spacing` as the minimum.
- Keep explicit zero handling for the current segment and retain the English and
  Polish strings required by the local current-weather controls.

## Upstream recovery

The private recovery commits from the previous base (`b63fa4d`, `5e56677`,
`a7d5938`, and `4555921`) are intentionally omitted. Their behavior is supplied
by upstream commit `265dc8fc69c793a9a1471828994cedcd7da71fa8`, which remains the
single recovery implementation in this tree. The private CodeQL workflow
adjustment (`1340822`) is retained: analysis runs only for public repositories,
preserving the existing private repository CI policy.

## Maintenance

The candidate is based on old private parent `776799d6ecec894703cbe467d641ce354c597077`
and must be released by the owner after review. The local package version is
`7.0.0-elmakus.5`. Before deployment, run lint, Cypress, and a production build
from a clean checkout of the selected release commit.
