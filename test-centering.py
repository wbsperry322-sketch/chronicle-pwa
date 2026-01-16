from playwright.sync_api import sync_playwright

def test_centering():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Load the page
        page.goto('http://localhost:8000/index.html')
        page.wait_for_timeout(1500)

        # Click "Play Locally" to start demo game
        page.click('#demo-btn')
        page.wait_for_timeout(2000)

        # Screenshot the game with card
        page.screenshot(path='game-with-card.png')
        print("Screenshot saved: game-with-card.png")

        # Now try to trigger incorrect feedback
        # Execute JavaScript to directly trigger showFeedback
        page.evaluate("""
            showFeedback(
                false,  // incorrect
                gameState.currentCard.y,
                0,      // player index
                gameState.currentCard.d || '',
                gameState.currentCard.e,
                0       // wrong position
            );
        """)
        page.wait_for_timeout(500)

        # Screenshot the incorrect modal
        page.screenshot(path='incorrect-modal.png')
        print("Screenshot saved: incorrect-modal.png")

        browser.close()

if __name__ == "__main__":
    test_centering()
