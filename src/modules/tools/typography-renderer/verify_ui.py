
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_typography_tool():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the app (assuming localhost:5173 based on Vite defaults)
        try:
            await page.goto("http://localhost:5173", timeout=60000)
            print("Navigated to app")
        except Exception as e:
            print(f"Failed to navigate: {e}")
            await browser.close()
            return

        # Wait for the tool to be visible or the category selector
        # Based on registry.tsx, it's in the 'image' category.
        # I need to find how to select the category.
        # Assuming there is a sidebar or similar.

        # Taking a screenshot of the initial page to see structure if I fail to find elements
        await page.screenshot(path="/home/jules/verification/initial_load.png")

        # Try to find the category button for "Image Generation" or similar
        # In the absence of DOM knowledge, I'll search for text "Image"
        try:
             # Click on "Image Generation" category if it exists
             await page.click("text=Image Generation", timeout=5000)
        except:
            print("Could not find 'Image Generation' text, trying to list tools directly")

        # Try to find the tool card "Typography & Material Renderer"
        try:
            await page.wait_for_selector("text=Typography & Material Renderer", timeout=5000)
            await page.click("text=Typography & Material Renderer")
            print("Clicked on tool card")
        except:
             print("Could not find tool card")
             # Force navigation or check if we are already there?
             # Let's take a screenshot to debug
             await page.screenshot(path="/home/jules/verification/debug_nav.png")

        # Now inside the tool, verify the new inputs exist

        # Check for Resolution dropdown (1K, 2K, 4K)
        # It's a select element with label "Resolution"
        try:
            # Finding label "Resolution" and checking its associated select
            # Or just finding the select by values
            await expect(page.get_by_text("Resolution")).to_be_visible()

            # Select 4K
            await page.select_option("select >> nth=1", "4K") # Might be risky if there are multiple selects
            # Better: find the select near the label
            # Assuming standard layout, select is next sibling or nested

            # Let's just screenshot the tool UI to verify visually
            await page.screenshot(path="/home/jules/verification/typography_tool_ui.png")
            print("Tool UI screenshot taken")

        except Exception as e:
            print(f"Failed to verify UI elements: {e}")
            await page.screenshot(path="/home/jules/verification/error.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_typography_tool())
