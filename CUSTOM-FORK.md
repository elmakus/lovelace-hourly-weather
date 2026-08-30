# elmakus private fork

This private fork is based on the current upstream `main` branch. The upstream
base incorporated here ends at `408f0da` and includes the native forecast-type
resubscription and strict numeric configuration validation changes.

## Custom changes

- Keep the last usable forecast, preserve the card frame while the initial
  subscription is pending, and recover stalled subscriptions through
  `weather.get_forecasts` without polling while normal updates are arriving.
- Add a current-weather `TERAZ`/`NOW` segment while keeping forecast intervals
  chronological and precipitation amounts tied to the correct interval.
- Show current precipitation and place forecast precipitation around segment
  markers directly on the weather bar.
- Adapt label spacing to the rendered card width.
- Provide the additional English and Polish strings required by the local
  current-weather controls.

The recovery health timer is reset by every valid subscription event. Failed
recovery is retried after 30 seconds.

## Maintenance

The repository keeps upstream history and an `upstream` remote. Rebase the
private `main` on the current upstream `main`, review whether any local behavior
became native, then run lint, Cypress and a production dashboard render before
deploying the rebuilt `dist/hourly-weather.js` manually.
