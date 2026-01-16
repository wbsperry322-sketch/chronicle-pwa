from playwright.sync_api import sync_playwright
from PIL import Image
import os

def compare_cards():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the prototype
        file_path = os.path.abspath('card-prototype.html')
        page.goto(f'file:///{file_path}')

        # Wait for page to load
        page.wait_for_timeout(1000)

        # Screenshot just the first current card
        current_card = page.locator('.card-current').first
        current_card.screenshot(path='current-single.png')

        # Screenshot just the first option 8 card
        option8_card = page.locator('.card-option8').first
        option8_card.screenshot(path='option8-single.png')

        browser.close()

        # Load both images
        img1 = Image.open('current-single.png')
        img2 = Image.open('option8-single.png')

        # Create a new image that combines both side by side
        total_width = img1.width + img2.width + 40  # 40px gap
        max_height = max(img1.height, img2.height)

        combined = Image.new('RGB', (total_width, max_height), color='#1a0f0a')

        # Paste images side by side
        combined.paste(img1, (0, 0))
        combined.paste(img2, (img1.width + 40, 0))

        combined.save('comparison.png')
        print(f"Comparison saved: comparison.png")
        print(f"Current card size: {img1.width}x{img1.height}")
        print(f"Option 8 card size: {img2.width}x{img2.height}")

if __name__ == "__main__":
    compare_cards()
