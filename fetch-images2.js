// Script to fetch Wikipedia images for ALL events - more aggressive matching
const fs = require('fs');

// Read current index.html to extract all events
const html = fs.readFileSync('index.html', 'utf8');

// Extract all event names
const eventRegex = /\{e:"([^"]+)",y:/g;
const events = [];
let match;
while ((match = eventRegex.exec(html)) !== null) {
    events.push(match[1]);
}

console.log(`Found ${events.length} events`);

// Load existing images
let existingImages = {};
try {
    existingImages = JSON.parse(fs.readFileSync('event-images.json', 'utf8'));
    console.log(`Loaded ${Object.keys(existingImages).length} existing images`);
} catch(e) {
    console.log('No existing images file');
}

// Alternative search terms for common patterns
function getSearchTerms(name) {
    const terms = [name];

    // Remove common suffixes
    const cleaned = name
        .replace(/\s+(begins|ends|founded|built|completed|discovered|invented|released|launched|elected|killed|dies|assassinated|born|crowned|signed|ratified|published|written|painted|composed|starts|created|established|formed|opens|arrives|becomes|takes|rules|conquers|defeats|invades|declares|proclaims|introduces|develops|founds|reforms|converts|preaches|teaches|writes|paints|composes)$/i, '')
        .trim();
    if (cleaned !== name) terms.push(cleaned);

    // Try with "the" removed
    if (name.startsWith('The ')) terms.push(name.slice(4));

    // Try just the main subject for possessive forms
    const possMatch = name.match(/^([^']+)'s?\s+(.+)$/);
    if (possMatch) {
        terms.push(possMatch[1]); // Just the person
        terms.push(possMatch[2]); // Just the work
    }

    // Common replacements
    terms.push(name.replace('WWI', 'World War I'));
    terms.push(name.replace('WWII', 'World War II'));
    terms.push(name.replace('US ', 'United States '));
    terms.push(name.replace('UK ', 'United Kingdom '));

    // Try removing parenthetical
    terms.push(name.replace(/\s*\([^)]+\)/, ''));

    return [...new Set(terms)].filter(t => t.length > 2);
}

// Fetch image from Wikipedia with multiple attempts
async function fetchWikiImage(eventName) {
    const searchTerms = getSearchTerms(eventName);

    for (const term of searchTerms) {
        try {
            const encodedTerm = encodeURIComponent(term.replace(/\s+/g, '_'));
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTerm}`);
            if (response.ok) {
                const data = await response.json();
                if (data.thumbnail && data.thumbnail.source) {
                    return data.thumbnail.source;
                }
            }
        } catch(e) {}

        // Small delay between attempts
        await new Promise(r => setTimeout(r, 50));
    }

    // Try Wikipedia search API as fallback
    try {
        const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(eventName)}&format=json&origin=*`);
        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.query && searchData.query.search && searchData.query.search[0]) {
                const title = searchData.query.search[0].title;
                const pageResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`);
                if (pageResponse.ok) {
                    const pageData = await pageResponse.json();
                    if (pageData.thumbnail && pageData.thumbnail.source) {
                        return pageData.thumbnail.source;
                    }
                }
            }
        }
    } catch(e) {}

    return null;
}

// Process events missing images
async function processEvents() {
    const images = { ...existingImages };
    let fetched = 0;
    let failed = 0;
    const missing = events.filter(e => !images[e]);

    console.log(`Need to fetch ${missing.length} images`);

    for (let i = 0; i < missing.length; i++) {
        const event = missing[i];

        const image = await fetchWikiImage(event);
        if (image) {
            images[event] = image;
            fetched++;
            console.log(`[${i+1}/${missing.length}] ✓ ${event}`);
        } else {
            failed++;
            console.log(`[${i+1}/${missing.length}] ✗ ${event}`);
        }

        // Save progress every 25 events
        if ((fetched + failed) % 25 === 0) {
            fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
            console.log(`Saved progress: ${Object.keys(images).length} images`);
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 100));
    }

    // Final save
    fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
    console.log(`\nDone! Total images: ${Object.keys(images).length}`);
    console.log(`Fetched: ${fetched}, Failed: ${failed}`);

    // List still missing
    const stillMissing = events.filter(e => !images[e]);
    if (stillMissing.length > 0) {
        console.log(`\nStill missing ${stillMissing.length} images:`);
        stillMissing.forEach(e => console.log(`  - ${e}`));
    }
}

processEvents();
