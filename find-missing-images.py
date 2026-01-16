from playwright.sync_api import sync_playwright
import json
import time

def find_missing_images():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load the page
        page.goto('http://localhost:8000/index.html')
        page.wait_for_timeout(2000)

        # Click "Play Locally" to start demo game
        page.click('#demo-btn')
        page.wait_for_timeout(2000)

        # Collect events without images by checking many cards
        missing_images = set()
        checked_events = set()

        print("Checking cards for missing images...")

        for i in range(500):  # Check 500 cards
            # Get current card info
            card_info = page.evaluate("""
                () => {
                    if (!gameState || !gameState.currentCard) return null;
                    const card = gameState.currentCard;
                    const hasImage = eventImages[card.e] ? true : false;
                    return {
                        name: card.e,
                        hasImage: hasImage
                    };
                }
            """)

            if card_info and card_info['name'] not in checked_events:
                checked_events.add(card_info['name'])
                if not card_info['hasImage']:
                    missing_images.add(card_info['name'])
                    print(f"  Missing: {card_info['name']}")

            # Draw next card
            page.evaluate("drawCard();")
            page.wait_for_timeout(500)

        browser.close()

        print(f"\n\nSummary:")
        print(f"Total unique events checked: {len(checked_events)}")
        print(f"Events missing images: {len(missing_images)}")

        if missing_images:
            print(f"\nEvents without images:")
            for event in sorted(missing_images):
                print(f"  - {event}")

if __name__ == "__main__":
    find_missing_images()
