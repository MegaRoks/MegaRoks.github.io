# megaroks.github.io

Personal page of Maxim Kamenev: one scrolling page with a short introduction and contacts.

Plain HTML, CSS and ES modules. No runtime dependencies, no bundler, no build step — the files in
this repository are the files GitHub Pages serves. Everything under `devDependencies` exists only to
check them.

## Running locally

```sh
npm install
npm start          # http://localhost:8000
```

## Checks

```sh
npm run lint       # eslint, stylelint, html-validate
npm run check      # local links, font coverage, metadata origin, JSON-LD, og:image, sitemap
npm test           # both of the above
npx lhci autorun   # Lighthouse, thresholds in lighthouserc.json
```

CI runs the same set on every push to `master` and on every pull request.

## How the scrolling works

Snapping between sections is CSS: `scroll-snap-type: y mandatory` on the document and
`scroll-snap-stop: always` on each section. Wheel, touch, the scrollbar, deep links and the page
without JavaScript are therefore handled natively.

`src/js/keyboard.js` is the one exception. Native keyboard scrolling moves by a line, and on a
mandatory snap container a 40px nudge is simply pulled back to where it started, so no amount of CSS
gives one section per key press. The module moves by whole sections instead, and touches nothing
else.

## Fonts

`src/fonts/alte-haas-grotesk-regular.woff2` is subset to printable ASCII plus the typographic
punctuation the copy is likely to need. There is no Node equivalent of `pyftsubset`, so regenerating
it is a manual step with [fontTools](https://github.com/fonttools/fonttools) rather than an npm
script:

```sh
pyftsubset alte-haas-grotesk-regular.ttf \
  --unicodes='U+0020-007E,U+00A0,U+00A9,U+00AE,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2022,U+20AC,U+2122' \
  --flavor=woff2 \
  --no-hinting \
  --output-file=src/fonts/alte-haas-grotesk-regular.woff2
```

`SUBSET_RANGES` in `tools/check-page.mjs` mirrors that `--unicodes` list. `npm run check` fails if a
page uses a character the subset does not cover, so editing the copy cannot silently fall back to a
system font.

## Contributing

Contributions are welcome. [Open an issue](https://github.com/MegaRoks/MegaRoks.github.io/issues/new)
for bugs and feature requests, or [submit a pull request](https://github.com/MegaRoks/MegaRoks.github.io/compare).

## License

[MIT](LICENSE).
