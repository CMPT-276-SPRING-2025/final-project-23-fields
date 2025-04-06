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
            // Navigate back to home first
            await driver.get(baseUrl);
            await driver.wait(until.titleIs('RoTypeAI'), 10000);
            
            // Use the Jump In button like a real user would
            const jumpInButton = await driver.wait(
                until.elementLocated(By.id('jumpin')),
                15000
            );
            await jumpInButton.click();
            
            // Wait for navigation and page load
            await driver.wait(until.urlContains('/Chatbot'), 15000);
            await driver.sleep(5000);  // Give React time to hydrate

            // Look for the chat container using the exact classes from Chatbot.jsx
            const chatContainer = await driver.wait(
                until.elementLocated(By.css('.bg-gray-200.flex.h-screen.justify-center')),
                20000
            );
            
            // Then find the chat interface inside the container
            const chatInterface = await chatContainer.findElement(
                By.css('.flex.flex-col.bg-gray-700.shadow-md')
            );
            
            // Find the input form and field
            const inputForm = await chatInterface.findElement(
                By.css('form.bg-neutral-900')
            );
            const inputField = await inputForm.findElement(
                By.css('input[type="text"]')
            );

            // Enter text
            await inputField.sendKeys('Create a test about the Inca Empire');
            
            // Find and click send button
            const sendButton = await inputForm.findElement(By.xpath('following-sibling::button[@id="send"]'));
            await sendButton.click();
            
            // Wait for response
            await driver.sleep(7000);
            
            // Verify messages appear
            const messages = await driver.wait(
                until.elementsLocated(By.css('#message .bg-neutral-900')),
                15000
            );
            assert.ok(messages.length > 0, 'No messages found');

        } catch (error) {
            console.error('Error in chatbot test:', error);
            // Take screenshot for debugging
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

