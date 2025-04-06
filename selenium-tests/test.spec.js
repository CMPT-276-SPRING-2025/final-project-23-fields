import { By, Builder, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';
import fs from 'fs/promises'; // Use ES modules for file system

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
        try {
            // Navigate to Chatbot and wait for load
            await driver.get(`${baseUrl}/Chatbot`);
            await driver.wait(until.urlContains('/Chatbot'), 15000);
            await driver.sleep(5000); // Increased wait time

            // Wait for root div first
            const rootDiv = await driver.wait(
                until.elementLocated(By.css('div#root')), 
                15000
            );

            // Wait for chat container using exact classes from Chatbot.jsx
            const chatContainer = await driver.wait(
                until.elementLocated(By.css('.bg-gray-200.flex.h-screen.justify-center.pt-14')),
                15000
            );

            // Find the chat interface using exact classes from Gemini.jsx
            const chatInterface = await driver.wait(
                until.elementLocated(By.css('.flex.flex-col.bg-gray-700.shadow-md.items-center.justify-around.rounded-md')),
                15000
            );

            // Find and interact with input form
            const inputForm = await driver.wait(
                until.elementLocated(By.css('form.bg-neutral-900.min-w-10\\/12')),
                15000
            );
            const inputField = await inputForm.findElement(By.css('input[type="text"]'));
            
            await inputField.clear();
            await inputField.sendKeys('Create a test about the Inca Empire');

            // Find and click send button
            const sendButton = await driver.findElement(By.id('send'));
            await sendButton.click();

            // Wait for response
            await driver.sleep(7000);

            // Check for messages
            const messages = await driver.wait(
                until.elementsLocated(By.css('#message .bg-neutral-900')),
                15000
            );
            assert.ok(messages.length > 0, 'No messages found');

        } catch (error) {
            console.error('Error in chatbot test:', error);
            // Take screenshot using ES modules
            const screenshot = await driver.takeScreenshot();
            await fs.writeFile('error-screenshot.png', screenshot, 'base64');
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});

