import json
import requests
import urllib.parse

def fetch_wikipedia_image(search_term):
    """Fetch image URL from Wikipedia API"""
    try:
        # Search for the page
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(search_term)}&format=json"
        search_response = requests.get(search_url)
        search_data = search_response.json()

        if not search_data.get('query', {}).get('search'):
            print(f"  No Wikipedia page found for: {search_term}")
            return None

        page_title = search_data['query']['search'][0]['title']
        print(f"  Found page: {page_title}")

        # Get page images
        images_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(page_title)}&prop=pageimages&format=json&pithumbsize=500"
        images_response = requests.get(images_url)
        images_data = images_response.json()

        pages = images_data.get('query', {}).get('pages', {})
        for page_id, page_data in pages.items():
            if 'thumbnail' in page_data:
                image_url = page_data['thumbnail']['source']
                print(f"  Found image: {image_url}")
                return image_url

        print(f"  No image found for: {page_title}")
        return None

    except Exception as e:
        print(f"  Error fetching image for {search_term}: {e}")
        return None

# Events missing images
missing_events = {
    "García Márquez's Solitude": "One Hundred Years of Solitude Gabriel Garcia Marquez",
    "Orwell's Nineteen Eighty-Four": "Nineteen Eighty-Four George Orwell",
    "Orwell's dystopia published": "Nineteen Eighty-Four 1984 book",
    "World War I": "World War I"
}

# Load existing event images
print("Loading event-images.json...")
with open('event-images.json', 'r', encoding='utf-8') as f:
    event_images = json.load(f)

print(f"Loaded {len(event_images)} existing images\n")

# Fetch images for missing events
print("Fetching images for missing events...\n")
for event_name, search_term in missing_events.items():
    print(f"Processing: {event_name}")

    if event_name in event_images and event_images[event_name]:
        print(f"  Already has image, skipping")
        continue

    image_url = fetch_wikipedia_image(search_term)

    if image_url:
        event_images[event_name] = image_url
        print(f"  Added image for: {event_name}")
    else:
        print(f"  Could not find image for: {event_name}")

    print()

# Save updated event images
print("\nSaving updated event-images.json...")
with open('event-images.json', 'w', encoding='utf-8') as f:
    json.dump(event_images, f, ensure_ascii=False, indent=2)

print(f"Done! Total images in database: {len(event_images)}")
