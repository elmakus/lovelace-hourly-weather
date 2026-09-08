describe('Precipitation bar overlay', () => {
  beforeEach(() => {
    cy.visitHarness();
  });

  it('places icons and precipitation around segment markers', () => {
    cy.configure({
      icons: true,
      num_segments: '4',
      label_spacing: '2',
      show_precipitation_amounts: true,
      show_precipitation_probability: true,
      precipitation_on_bar: true,
      precipitation_amount_font_size: 13,
      precipitation_probability_font_size: 9,
    });

    cy.get('weather-bar')
      .shadow()
      .find('.bar-overlay-item')
      .should('have.length', 4)
      .eq(0)
      .should('have.attr', 'aria-label')
      .and('contain', 'Cloudy')
      .and('contain', '0.7 in')
      .and('contain', '94% chance of precipitation');

    cy.get('weather-bar')
      .shadow()
      .find('.bar-overlay-item')
      .eq(0)
      .then(item => {
        const itemRect = item.get(0).getBoundingClientRect();
        const iconRect = item.find('ha-icon').get(0).getBoundingClientRect();
        const valuesRect = item.find('.bar-precipitation-stack').get(0).getBoundingClientRect();
        const markerCenter = itemRect.left + itemRect.width / 2;
        const gapCenter = (iconRect.right + valuesRect.left) / 2;
        expect(Math.abs(markerCenter - gapCenter)).to.be.lessThan(0.6);
      });

    cy.get('weather-bar').shadow().find('.bar-precipitation-amount')
      .first().should('have.css', 'font-size', '13px');
    cy.get('weather-bar').shadow().find('.bar-precipitation-probability')
      .first().should('have.css', 'font-size', '9px');
    cy.get('weather-bar').shadow().find('div.axes > div.bar-block div.precipitation')
      .each(el => cy.wrap(el).should('be.empty'));
  });

  it('supplies segment icons even when the regular icons option is disabled', () => {
    cy.configure({
      icons: false,
      num_segments: '2',
      label_spacing: '1',
      show_precipitation_amounts: true,
      precipitation_on_bar: true,
    });

    cy.get('weather-bar').shadow().find('.bar-overlay-item ha-icon')
      .should('have.length', 2);
    cy.get('weather-bar').shadow().find('.bar > div .condition-label')
      .should('not.exist');
  });

  it('keeps upstream current-weather behavior while hiding zero precipitation', () => {
    cy.viewport(478, 400);
    cy.setLocale({ language: 'en', time_format: '12' });
    cy.window().then((win: any) => {
      cy.addEntity({
        'weather.current_overlay': {
          state: 'cloudy',
          last_updated: '2022-07-21T16:45:00+00:00',
          attributes: {
            temperature: 12,
            precipitation: 0,
            precipitation_probability: 0,
            precipitation_unit: 'mm',
            forecast: win.hourlyWeather.hass.states['weather.mock'].attributes.forecast,
          },
        },
      });
    });

    cy.configure({
      entity: 'weather.current_overlay',
      num_segments: '2',
      label_spacing: '1',
      show_current: true,
      hide_minutes: true,
      show_precipitation_amounts: true,
      show_precipitation_probability: true,
      precipitation_on_bar: true,
    });

    cy.get('weather-bar').shadow().find('.current-time')
      .should('have.text', 'Now')
      .and('have.attr', 'title', '4:45 PM');
    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .find('ha-icon').should('exist');
    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .find('.bar-precipitation-amount').should('not.exist');
    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .find('.bar-precipitation-probability').should('not.exist');
  });

  it('shows ongoing forecast precipitation on the current overlay segment', () => {
    cy.window().then((win: any) => {
      cy.addEntity({
        'weather.current_overlay_fallback': {
          state: 'rainy',
          last_updated: '2022-07-21T17:15:00+00:00',
          attributes: {
            temperature: 12,
            precipitation_unit: 'mm',
            forecast: win.hourlyWeather.hass.states['weather.mock'].attributes.forecast,
          },
        },
      });
    });

    cy.configure({
      entity: 'weather.current_overlay_fallback',
      num_segments: '2',
      label_spacing: '1',
      show_current: true,
      show_precipitation_amounts: true,
      show_precipitation_probability: true,
      precipitation_on_bar: true,
    });

    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .should('have.attr', 'aria-label')
      .and('contain', 'Rain')
      .and('contain', '0.35 mm')
      .and('contain', '75% chance of precipitation');
    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .find('.bar-precipitation-amount').should('have.text', '0.35 mm');
    cy.get('weather-bar').shadow().find('.bar-overlay-item').first()
      .find('.bar-precipitation-probability').should('have.text', '75%');
  });

  it('follows automatic label spacing as the card width changes', () => {
    cy.viewport(478, 400);
    cy.configure({
      num_segments: '12',
      label_spacing: '1',
      auto_label_spacing: true,
      show_precipitation_amounts: true,
      precipitation_on_bar: true,
    });

    cy.get('weather-bar').shadow().find('.bar-overlay-item ha-icon')
      .should('have.length', 6);

    cy.get('#wrapper').invoke('css', 'max-width', '900px');
    cy.viewport(900, 400);
    cy.get('weather-bar').shadow().find('.bar-overlay-item ha-icon')
      .should('have.length', 12);
  });
});
