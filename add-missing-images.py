import json

# Load existing event images
print("Loading event-images.json...")
with open('event-images.json', 'r', encoding='utf-8') as f:
    event_images = json.load(f)

print(f"Loaded {len(event_images)} existing images\n")

# Manually add images for missing events
# These are Wikipedia thumbnail URLs for the relevant topics
missing_images = {
    "García Márquez's Solitude": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg/220px-Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
    "Orwell's Nineteen Eighty-Four": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/220px-1984first.jpg",
    "Orwell's dystopia published": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/220px-1984first.jpg",
    "World War I": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cheshire_Regiment_trench_Somme_1916.jpg/300px-Cheshire_Regiment_trench_Somme_1916.jpg"
}

# Add the images
for event_name, image_url in missing_images.items():
    if event_name in event_images:
        print(f"Updating: {event_name}")
    else:
        print(f"Adding: {event_name}")

    event_images[event_name] = image_url

# Save updated event images
print("\nSaving updated event-images.json...")
with open('event-images.json', 'w', encoding='utf-8') as f:
    json.dump(event_images, f, ensure_ascii=False, indent=2)

print(f"Done! Total images in database: {len(event_images)}")
print(f"\nAdded/updated {len(missing_images)} images:")
for event_name in missing_images.keys():
    print(f"  - {event_name}")
