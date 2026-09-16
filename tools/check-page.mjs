/**
 * Static checks for the published pages, run in CI.
 *
 * @see README.md for the pyftsubset command SUBSET_RANGES has to stay in sync with.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const PAGES = ['index.html', '404.html'];
const ORIGIN = 'https://megaroks.github.io/';

/** Codepoint ranges present in the subset font, inclusive. */
const SUBSET_RANGES = [
    [0x0020, 0x007e],
    [0x00a0, 0x00a0],
    [0x00a9, 0x00a9],
    [0x00ae, 0x00ae],
    [0x2013, 0x2014],
    [0x2018, 0x2019],
    [0x201c, 0x201d],
    [0x2022, 0x2022],
    [0x2026, 0x2026],
    [0x20ac, 0x20ac],
    [0x2122, 0x2122],
];

const failures = [];

/**
 * Records a failure unless the condition holds.
 *
 * @param {boolean} condition - What has to be true.
 * @param {string} message - What to report when it is not.
 * @returns {void}
 */
function expect(condition, message) {
    if (!condition) {
        failures.push(message);
    }
}

/**
 * Strips tags and resolves entities, leaving the text a reader sees.
 *
 * @param {string} html - Markup of a full page.
 * @returns {string} The visible text.
 */
function extractText(html) {
    return html
        .slice(html.indexOf('<body>'))
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

/**
 * Reads the pixel dimensions out of a PNG header.
 *
 * @param {Buffer} buffer - Contents of a PNG file.
 * @returns {{ width: number, height: number }} The declared dimensions.
 */
function readPngSize(buffer) {
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
    };
}

/**
 * Every local href/src resolves to a file that exists.
 *
 * @param {string} page - Page filename, for the message.
 * @param {string} html - Markup of that page.
 * @returns {void}
 */
function checkLocalReferences(page, html) {
    for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|#)/.test(reference)) {
            continue;
        }

        const path = reference.replace(/^\.?\//, '').replace(/(^$|\/$)/, 'index.html');

        expect(existsSync(path), `${page}: broken reference ${reference}`);
    }
}

/**
 * Every visible character is covered by the subset font.
 *
 * @param {string} page - Page filename, for the message.
 * @param {string} html - Markup of that page.
 * @returns {void}
 */
function checkFontCoverage(page, html) {
    const uncovered = new Set();

    for (const character of extractText(html)) {
        if (/\s/.test(character)) {
            continue;
        }

        const codepoint = character.codePointAt(0);
        const covered = SUBSET_RANGES.some(([from, to]) => codepoint >= from && codepoint <= to);

        if (!covered) {
            uncovered.add(`${character} (U+${codepoint.toString(16).toUpperCase().padStart(4, '0')})`);
        }
    }

    expect(uncovered.size === 0, `${page}: characters outside the font subset: ${[...uncovered].join(', ')}`);
}

/**
 * Absolute URLs in metadata point at the canonical origin.
 *
 * @param {string} page - Page filename, for the message.
 * @param {string} html - Markup of that page.
 * @returns {void}
 */
function checkMetadataOrigin(page, html) {
    for (const [, url] of html.matchAll(/<meta[^>]+content="(https:\/\/[^"]+)"/g)) {
        expect(url.startsWith(ORIGIN), `${page}: metadata URL outside the canonical origin: ${url}`);
    }
}

/**
 * The JSON-LD block parses and describes the right person at the right URL.
 *
 * @param {string} html - Markup of the home page.
 * @returns {void}
 */
function checkStructuredData(html) {
    const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    if (!block) {
        failures.push('index.html: no JSON-LD block');
        return;
    }

    try {
        const data = JSON.parse(block[1]);

        expect(data['@context'] === 'https://schema.org', 'index.html: JSON-LD @context is not schema.org');
        expect(data.url === ORIGIN, `index.html: JSON-LD url is ${data.url}, expected ${ORIGIN}`);
    } catch (error) {
        failures.push(`index.html: JSON-LD does not parse (${error.message})`);
    }
}

/**
 * og:image dimensions match the file that will be served.
 *
 * @param {string} html - Markup of the home page.
 * @returns {Promise<void>} Resolves once the image has been read.
 */
async function checkSocialImage(html) {
    const declared = Object.fromEntries(
        [...html.matchAll(/<meta property="og:image:(width|height)" content="(\d+)"/g)].map(([, key, value]) => [
            key,
            Number(value),
        ]),
    );

    const path = 'src/images/og-image.png';

    if (!existsSync(path)) {
        failures.push(`${path} is missing`);
        return;
    }

    const actual = readPngSize(await readFile(path));

    expect(
        actual.width === declared.width && actual.height === declared.height,
        `og:image is ${actual.width}x${actual.height} but declared ${declared.width}x${declared.height}`,
    );
}

/**
 * The sitemap lists the canonical URL.
 *
 * @returns {Promise<void>} Resolves once the sitemap has been read.
 */
async function checkSitemap() {
    const sitemap = await readFile('sitemap.xml', 'utf8');

    expect(sitemap.includes(`<loc>${ORIGIN}</loc>`), `sitemap.xml does not list ${ORIGIN}`);
}

for (const page of PAGES) {
    const html = await readFile(page, 'utf8');

    checkLocalReferences(page, html);
    checkFontCoverage(page, html);
    checkMetadataOrigin(page, html);
}

const home = await readFile('index.html', 'utf8');

checkStructuredData(home);
await checkSocialImage(home);
await checkSitemap();

if (failures.length > 0) {
    process.stderr.write(`${failures.map((failure) => `  ${failure}`).join('\n')}\n`);
    process.exit(1);
}

process.stdout.write(`${PAGES.join(', ')}: all checks passed\n`);
