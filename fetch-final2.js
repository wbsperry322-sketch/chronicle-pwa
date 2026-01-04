// Final script - try alternate Wikipedia articles
const fs = require('fs');

const finalMappings = {
  "St. Bartholomew Massacre": "Catherine_de%27_Medici",
  "Brown v. Board": "Thurgood_Marshall",
  "Iron Age begins": "Hittites",
  "Uruk becomes first city": "Sumer",
  "Pueblo Revolt": "New_Mexico",
  "Phoenician alphabet spreads": "Byblos",
  "Seljuk Turks take Baghdad": "Tughra",
  "Good Friday Agreement": "Northern_Ireland",
  "Dead Sea Scrolls written": "Qumran",
  "Kuhn's Structure of Revolutions": "Paradigm_shift",
  "Notre-Dame school": "Pérotin",
  "Banksy's street art": "Street_art",
  "Hundred Years War resumes": "Battle_of_Agincourt",
  "Peasants' Revolt": "Wat_Tyler",
  "Lorenzo de' Medici rules Florence": "Medici",
  "St. Peter's Basilica begun": "Vatican_City",
  "Peasants' War": "Thomas_Müntzer",
  "Empire State Building": "New_York_City",
  "Roe v. Wade": "Supreme_Court_of_the_United_States",
  "Napster launched": "File_sharing",
  "AlphaGo defeats Lee Sedol": "Go_(game)"
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
    let failed = 0;
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
            failed++;
            failedEvents.push(event);
            console.log(`✗ ${event} (tried: ${wikiTerm})`);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    fs.writeFileSync('event-images.json', JSON.stringify(images, null, 2));
    console.log(`\nDone! Total images: ${Object.keys(images).length}`);
    console.log(`Fetched: ${fetched}, Failed: ${failed}`);
    if (failedEvents.length > 0) {
        console.log('\nStill missing:');
        failedEvents.forEach(e => console.log(`  - ${e}`));
    }
}

processEvents();
