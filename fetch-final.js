// Final script to fetch remaining 50 images
const fs = require('fs');

const finalMappings = {
  "St. Bartholomew Massacre": "St._Bartholomew%27s_Day_massacre",
  "Brown v. Board": "Brown_v._Board_of_Education",
  "Domestication of horses": "Horse",
  "Iron Age begins": "Iron_Age",
  "Uruk becomes first city": "Uruk",
  "Maya collapse": "Maya_civilization",
  "Pueblo Revolt": "Pueblo_Revolt",
  "Phoenician alphabet spreads": "Phoenician_alphabet",
  "Seljuk Turks take Baghdad": "Seljuk_Empire",
  "Caesar crosses Rubicon": "Julius_Caesar",
  "Good Friday Agreement": "Good_Friday_Agreement",
  "Dead Sea Scrolls written": "Dead_Sea_Scrolls",
  "Kuhn's Structure of Revolutions": "Thomas_Kuhn",
  "Notre-Dame school": "School_of_Notre-Dame",
  "Punk rock emerges": "Ramones",
  "Hip-hop goes mainstream": "Run-DMC",
  "Picasso's Les Demoiselles": "Pablo_Picasso",
  "Warhol's Campbell's Soup": "Andy_Warhol",
  "Banksy's street art": "Banksy",
  "Doppler effect discovered": "Christian_Doppler",
  "Trial of Socrates": "Socrates",
  "Hundred Years War resumes": "Hundred_Years%27_War",
  "Reformation begins": "Martin_Luther",
  "Trajan's Column erected": "Trajan",
  "Arabs conquer Egypt": "Amr_ibn_al-As",
  "Children's Crusade": "Crusades",
  "Peasants' Revolt": "Peasants%27_Revolt",
  "Lorenzo de' Medici rules Florence": "Lorenzo_de%27_Medici",
  "St. Peter's Basilica begun": "St._Peter%27s_Basilica",
  "Peasants' War": "German_Peasants%27_War",
  "Gregorian calendar adopted": "Pope_Gregory_XIII",
  "Japan closes borders": "Tokugawa_shogunate",
  "Washington's Farewell": "George_Washington",
  "Nat Turner's rebellion": "Nat_Turner",
  "Cholera pandemic": "Cholera",
  "John Brown's raid": "John_Brown_(abolitionist)",
  "Picasso's Demoiselles": "Pablo_Picasso",
  "Empire State Building": "Empire_State_Building",
  "Nixon visits China": "Richard_Nixon",
  "Roe v. Wade": "Roe_v._Wade",
  "Phoenicians invent alphabet": "Phoenicia",
  "Solomon builds First Temple": "Solomon",
  "Hadrian builds wall": "Hadrian",
  "Neo-Platonism founded": "Plotinus",
  "Christian Bible compiled": "Bible",
  "Edison's light bulb": "Thomas_Edison",
  "Windows released": "Bill_Gates",
  "Napster launched": "Napster",
  "AlphaGo defeats Lee Sedol": "AlphaGo",
  "First image of black hole": "Black_hole"
};

// Load existing images
let images = {};
try {
    images = JSON.parse(fs.readFileSync('event-images.json', 'utf8'));
    console.log(`Loaded ${Object.keys(images).length} existing images`);
} catch(e) {
    console.log('No existing images file');
}

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
