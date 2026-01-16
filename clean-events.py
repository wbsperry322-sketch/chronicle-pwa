import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the EVENTS array line
events_match = re.search(r'const EVENTS=\[(.*?)\];', content, re.DOTALL)
if not events_match:
    print("Could not find EVENTS array")
    exit(1)

events_str = events_match.group(1)

# Split into individual event objects
events = re.findall(r'\{e:"[^"]+",y:-?\d+,d:"[^"]+"(?:,img:"[^"]+")?\}', events_str)

# Filter out events with 4-digit years or specific date patterns in the name
filtered_events = []
removed_count = 0
for event in events:
    event_name = re.search(r'e:"([^"]+)"', event).group(1)
    # Check if event name contains 4-digit year, Y2K, 9/11, COVID-19, or other date patterns
    if re.search(r'\b\d{4}\b|Y2K|9/11|COVID-19|1848|1905|1812|1054', event_name):
        removed_count += 1
        print(f"Removing: {event_name}")
    else:
        filtered_events.append(event)

print(f"\nRemoved {removed_count} events")
print(f"Remaining events: {len(filtered_events)}")

# Rebuild the EVENTS array
new_events_str = ','.join(filtered_events)
new_content = content.replace(events_match.group(0), f'const EVENTS=[{new_events_str}];')

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done!")
