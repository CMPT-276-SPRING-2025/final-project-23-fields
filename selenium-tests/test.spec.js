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
            // Navigate to Chatbot and wait for load with retry logic
            await driver.get(`${baseUrl}/Chatbot`);
            await driver.wait(until.urlContains('/Chatbot'), 15000);
            
            // Wait for React app to load with retry
            let rootDiv;
            for (let i = 0; i < 3; i++) {
                try {
                    await driver.sleep(3000); // Wait for React to initialize
                    rootDiv = await driver.wait(
                        until.elementLocated(By.css('#root')), 
                        10000
                    );
                    break;
                } catch (error) {
                    console.log(`Attempt ${i + 1} to find root div failed`);
                    if (i === 2) throw error;
                }
            }

            // Wait for chat interface using the exact structure from Gemini.jsx
            const chatInterface = await driver.wait(
                until.elementLocated(By.css('.flex.flex-col.bg-gray-700.shadow-md')),
                15000
            );
            
            // Find input form - using the exact structure from Gemini.jsx
            const inputForm = await chatInterface.findElement(
                By.css('form.bg-neutral-900')
            );
            const inputField = await inputForm.findElement(
                By.css('input[type="text"]')
            );

            // Enter text and submit
            await inputField.clear();
            await inputField.sendKeys('Create a test about the Inca Empire');

            const sendButton = await driver.findElement(By.id('send'));
            await sendButton.click();

            // Wait for response with verification
            await driver.sleep(7000);

            const messages = await driver.wait(
                until.elementsLocated(By.css('#message .bg-neutral-900')),
                15000
            );
            assert.ok(messages.length > 0, 'No messages found');

        } catch (error) {
            console.error('Error in chatbot test:', error);
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

