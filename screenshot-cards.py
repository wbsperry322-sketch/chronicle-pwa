from playwright.sync_api import sync_playwright
import os

def capture_cards():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the prototype
        file_path = os.path.abspath('card-prototype.html')
        page.goto(f'file:///{file_path}')

        # Wait for page to load
        page.wait_for_timeout(1000)

        # Screenshot the current cards section
        current_section = page.locator('.prototype-section').first
        current_section.screenshot(path='current-cards.png')

        # Screenshot the option 8 section
        option8_section = page.locator('.prototype-section').nth(8)  # Option 8 is the 9th section (0-indexed)
        option8_section.screenshot(path='option8-cards.png')

        browser.close()
        print("Screenshots saved: current-cards.png and option8-cards.png")

if __name__ == "__main__":
    capture_cards()
