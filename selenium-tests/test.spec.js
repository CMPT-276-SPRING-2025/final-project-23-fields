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
            // Start from home and verify React is mounted
            await driver.get(baseUrl);
            await driver.wait(async () => {
                const elements = await driver.findElements(By.css('.font-jost.font-bold'));
                return elements.length > 0;
            }, 15000, 'Home page not loaded');
            
            // Click Jump In using parent Link element
            const jumpInLink = await driver.wait(
                until.elementLocated(By.css('a#jumpin')), 
                15000
            );
            await jumpInLink.click();
            
            // Wait for URL change and React mount
            await driver.wait(until.urlContains('/Chatbot'), 15000);
            await driver.wait(async () => {
                const elements = await driver.findElements(By.css('.bg-gray-700.shadow-md'));
                return elements.length > 0;
            }, 20000, 'Chat interface not loaded');

            // Get input field and send message
            const inputField = await driver.wait(
                until.elementLocated(By.css('form.bg-neutral-900 input[type="text"]')),
                15000
            );
            await inputField.sendKeys('Create a test about the Inca Empire');

            // Find and click send button
            const sendButton = await driver.findElement(By.id('send'));
            await sendButton.click();

            // Verify chat message appears
            await driver.wait(async () => {
                const messages = await driver.findElements(By.css('#message .bg-neutral-900'));
                return messages.length > 0;
            }, 15000, 'No chat messages found');

        } catch (error) {
            console.error('Error in chatbot test:', error);
            // Log page source for debugging
            const source = await driver.getPageSource();
            console.error('Page source:', source);
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});

