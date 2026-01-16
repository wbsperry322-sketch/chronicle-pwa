from playwright.sync_api import sync_playwright
import time

def test_all_card_states():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Load the page
        page.goto('http://localhost:8000/index.html')
        page.wait_for_timeout(1500)

        # Click "Play Locally" to start demo game
        page.click('#demo-btn')
        page.wait_for_timeout(2000)

        # Capture multiple cards by refreshing and screenshotting
        for i in range(5):
            # Screenshot the current card
            page.screenshot(path=f'card-test-{i+1}.png')
            print(f"Screenshot saved: card-test-{i+1}.png")

            # Skip the card to get a new one
            page.evaluate("skipCard();")
            page.wait_for_timeout(1000)

        browser.close()

if __name__ == "__main__":
    test_all_card_states()
