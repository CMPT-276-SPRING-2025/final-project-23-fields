import { By, Builder, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';

describe('RoTypeAI Website Tests', function() {
    let driver;
    let baseUrl;
    
    this.timeout(60000);

    before(async function() {
        baseUrl = process.env.STAGING_URL || 'http://localhost:5173';
        console.log('Testing URL:', baseUrl);

        const options = new Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000 
        });

        await driver.get(baseUrl);
    });

    it('should load home page and verify elements', async function() {
        await driver.wait(until.titleIs('RoTypeAI'), 10000);
        const title = await driver.getTitle();
        assert.equal(title, 'RoTypeAI');

        const howToUseButton = await driver.wait(
            until.elementLocated(By.id('howtouse')), 
            15000
        );
        const jumpInButton = await driver.wait(
            until.elementLocated(By.id('jumpin')), 
            15000
        );

        assert.ok(await howToUseButton.isDisplayed());
        assert.ok(await jumpInButton.isDisplayed());
    });

    it('should navigate through tutorial', async function() {
        const howToUseButton = await driver.findElement(By.id('howtouse'));
        await howToUseButton.click();
        await driver.wait(until.urlContains('/Tutorial'), 10000);
        await driver.sleep(2000);

        // Find and click next button by div id
        for(let i = 0; i < 5; i++) {
            const nextButton = await driver.wait(
                until.elementLocated(By.css('button div[id="next"]')),  // CORRECT
                10000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", nextButton);
            await driver.sleep(1000);
            await nextButton.click();
        }
    });

    it('should test chatbot functionality', async function() {
        // Navigate directly to Chatbot with longer wait
        await driver.get(`${baseUrl}/Chatbot`);
        await driver.wait(until.urlContains('/Chatbot'), 15000);
        await driver.sleep(3000);  // Increased sleep time

        try {
            // Wait for the outer container first
            const container = await driver.wait(
                until.elementLocated(By.css('.bg-zinc-800')), 
                15000
            );

            // Then wait for the chat interface
            const chatInterface = await driver.wait(
                until.elementLocated(By.css('.bg-gray-700.shadow-md.items-center.justify-around.rounded-md')),
                15000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", chatInterface);
            await driver.sleep(2000);  // Wait for scroll

            // Find input field with the exact structure from Gemini.jsx
            const inputField = await driver.wait(
                until.elementLocated(By.css('.bg-neutral-900.min-w-10\\/12 input[type="text"]')),
                15000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", inputField);
            await inputField.clear();
            await inputField.sendKeys('Create a test about the Inca Empire');
            
            // Find send button with exact ID and class
            const sendButton = await driver.wait(
                until.elementLocated(By.id('send')),
                15000
            );
            await sendButton.click();
            
            // Wait longer for API response and initial message
            await driver.sleep(10000);
            
            // Check for messages using exact class structure from Gemini.jsx
            const messages = await driver.wait(
                until.elementsLocated(By.css('#message .bg-neutral-900.mr-\\[0\\.5vw\\].rounded-md.p-2.font-inter')),
                20000
            );
            assert.ok(messages.length > 0, 'No messages found');
            
            const lastMessage = messages[messages.length - 1];
            const botResponse = await lastMessage.getText();
            assert.ok(botResponse.length > 0, 'Bot did not respond');

        } catch (error) {
            console.error('Error in chatbot test:', error);
            // Take screenshot for debugging
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('error-screenshot.png', screenshot, 'base64');
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});

