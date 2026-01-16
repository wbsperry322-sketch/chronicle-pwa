import json

# Read the event-images.json file
with open('event-images.json', 'r', encoding='utf-8') as f:
    event_images = json.load(f)

# Find events with blank or missing images
blank_events = []

for event_name, image_url in event_images.items():
    if not image_url or image_url.strip() == "":
        blank_events.append(event_name)

# Print results
print(f"Total events: {len(event_images)}")
print(f"Events with blank images: {len(blank_events)}")
print("\nEvents with blank images:")
for event in sorted(blank_events):
    print(f"  - {event}")
