# elmakus private fork

This private fork is based on Hourly Weather Card 7.0.0. The upstream release
already contains the night-aware partly-cloudy icon support that was previously
carried by the local `hourly-weather-night-aware` bundle.

## Custom change

The upstream card intentionally renders nothing while its forecast subscription
is pending. In a long-lived Home Assistant dashboard, a subscription can
occasionally stall or emit a transient empty refresh, leaving the entire card at
zero height indefinitely.

This fork keeps the last usable forecast, preserves the card frame while the
initial request is pending, and calls `weather.get_forecasts` if the event stream
does not deliver. A valid subscription event resets a 35-minute health timer, so
the fallback does not poll while normal updates are arriving. Failed recovery is
retried after 30 seconds.

## Maintenance

The repository keeps upstream history and an `upstream` remote. For a new
release, compare its forecast subscription lifecycle with this patch, remove any
part that became native, then run lint, Cypress and a production dashboard
render before deploying the rebuilt `dist/hourly-weather.js` manually.
