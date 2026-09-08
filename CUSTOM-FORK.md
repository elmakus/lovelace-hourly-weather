# elmakus fork maintenance notes

This fork is rebuilt from upstream `decompil3d/lovelace-hourly-weather` `main` at:

`2b64f8513bd72868d381faac8e835b4c39b988f0`

## Local delta

The fork intentionally keeps only the custom precipitation presentation on the colored weather bar.

Local options:

- `precipitation_on_bar`: show the condition icon and precipitation values directly on the colored bar instead of repeating precipitation below it.
- `precipitation_amount_font_size`: amount font size in pixels, default `11`.
- `precipitation_probability_font_size`: probability font size in pixels, default `10`.

When the bar overlay is enabled, each displayed label interval gets its condition icon next to the precipitation amount/probability. The overlay follows `label_spacing`, supports the upstream current-weather segment, hides zero precipitation values, and uses the upstream day/night condition resolution.

Example:

```yaml
show_precipitation_amounts: true
show_precipitation_probability: true
precipitation_on_bar: true
precipitation_amount_font_size: 11
precipitation_probability_font_size: 9
```

## Supplied by upstream

Do not reintroduce local copies of these features:

- current weather segment (`show_current`), including the localized `Now` label, chronological forecast handling, current precipitation fallback, and timestamp tooltip;
- responsive automatic label spacing (`auto_label_spacing`);
- stalled forecast subscription recovery;
- calm wind-barb rotation fix;
- Cypress 16 and current development dependencies.

## CI and package metadata

CI workflows and package/dependency metadata intentionally follow upstream without local policy overrides. In particular, there is no local CodeQL private-repository exception.

## Maintenance rule

Future updates should start from the latest upstream `main` and reapply only the still-needed precipitation-overlay delta. Avoid carrying old whole-file versions forward when upstream has changed the same areas.
