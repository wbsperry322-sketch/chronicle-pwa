// Script to fetch Wikipedia images for all events
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

// Function to clean event name for Wikipedia search
function cleanEventName(name) {
    return name
        .replace(/\s+(begins|ends|founded|built|completed|discovered|invented|released|launched|elected|killed|dies|assassinated|born|crowned|signed|ratified|published|written|painted|composed)$/i, '')
        .replace(/['']s?\s/g, ' ')
        .replace(/\s+/g, '_')
        .trim();
}

// Fetch image from Wikipedia
async function fetchWikiImage(eventName) {
    const searchTerm = cleanEventName(eventName);

    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.thumbnail && data.thumbnail.source) {
                return data.thumbnail.source;
            }
        }
    } catch(e) {
        // Try alternative search terms
    }

    // Try without cleaning
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(eventName.replace(/\s+/g, '_'))}`);
        if (response.ok) {
            const data = await response.json();
            if (data.thumbnail && data.thumbnail.source) {
                return data.thumbnail.source;
            }
        }
    } catch(e) {}

    return null;
}

// Process all events
async function processEvents() {
    const images = { ...existingImages };
    let fetched = 0;
    let failed = 0;

    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        // Skip if already have image
        if (images[event]) {
            continue;
        }

        const image = await fetchWikiImage(event);
        if (image) {
            images[event] = image;
            fetched++;
            console.log(`[${i+1}/${events.length}] ✓ ${event}`);
        } else {
            failed++;
            console.log(`[${i+1}/${events.length}] ✗ ${event}`);
        }

        // Save progress every 50 events
        if ((fetched + failed) % 50 === 0) {
            fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
            console.log(`Saved progress: ${Object.keys(images).length} images`);
        }

        // Rate limit - wait 100ms between requests
        await new Promise(r => setTimeout(r, 100));
    }

    // Final save
    fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
    console.log(`\nDone! Total images: ${Object.keys(images).length}`);
    console.log(`Fetched: ${fetched}, Failed: ${failed}`);
}

processEvents();
