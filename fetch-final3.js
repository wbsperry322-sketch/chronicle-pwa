// Final 5 images
const fs = require('fs');

const finalMappings = {
  "St. Bartholomew Massacre": "Henry_IV_of_France",
  "Kuhn's Structure of Revolutions": "Scientific_revolution",
  "Notre-Dame school": "Notre-Dame_de_Paris",
  "Banksy's street art": "Graffiti",
  "Napster launched": "Shawn_Fanning"
};

let images = JSON.parse(fs.readFileSync('event-images.json', 'utf8'));
console.log(`Loaded ${Object.keys(images).length} existing images`);

async function fetchWikiImage(searchTerm) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.thumbnail && data.thumbnail.source) {
                return data.thumbnail.source;
            }
        }
    } catch(e) {}
    return null;
}

async function processEvents() {
    let fetched = 0;
    const failedEvents = [];

    for (const [event, wikiTerm] of Object.entries(finalMappings)) {
        if (images[event]) {
            console.log(`✓ Already have: ${event}`);
            continue;
        }

        const image = await fetchWikiImage(wikiTerm);
        if (image) {
            images[event] = image;
            fetched++;
            console.log(`✓ ${event}`);
        } else {
            failedEvents.push(event);
            console.log(`✗ ${event} (tried: ${wikiTerm})`);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
    console.log(`\nDone! Total images: ${Object.keys(images).length}`);
    if (failedEvents.length > 0) {
        console.log('\nStill missing:');
        failedEvents.forEach(e => console.log(`  - ${e}`));
    }
}

processEvents();
