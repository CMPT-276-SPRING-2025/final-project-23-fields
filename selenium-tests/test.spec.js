import { By, Builder, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';
import fs from 'fs/promises'; 

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

        // Navigate to tutorial page
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
                until.elementLocated(By.css('button div[id="next"]')),  
                10000
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", nextButton);
            await driver.sleep(1000);
            await nextButton.click();
        }
    });

    it('should test chatbot functionality', async function() {
        try {
            // Navigate back to home and wait for full page load
            await driver.get(baseUrl);
            await driver.sleep(3000); 
            
            // Wait for title element to be visible using a more specific selector
            const titleElement = await driver.wait(
                until.elementLocated(By.css('.text-\\[3rem\\].text-blue-600.font-jost.font-bold')), 
                15000,
                'Title not found'
            );
            await driver.wait(until.elementIsVisible(titleElement), 15000);

            // Find and click Jump In with verification
            const jumpInLink = await driver.wait(
                until.elementLocated(By.css('a#jumpin div.bg-gray-700')), 
                15000,
                'Jump In button not found'
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", jumpInLink);
            await driver.wait(until.elementIsVisible(jumpInLink), 15000);
            await jumpInLink.click();

            // Wait for chatbot interface with multiple element checks
            await driver.wait(until.urlContains('/Chatbot'), 15000);
            await driver.sleep(5000); // Wait for page transition

            // Look for chat container with exact classes from Chatbot.jsx
            const chatContainer = await driver.wait(
                until.elementLocated(By.css('.bg-gray-200.flex.h-screen.justify-center.pt-14')),
                20000,
                'Chat container not found'
            );

            // Find input form within chat interface
            const inputForm = await driver.wait(
                until.elementLocated(By.css('form.bg-neutral-900.min-w-10\\/12')),
                15000,
                'Input form not found'
            );

            // Find and interact with input field
            const inputField = await inputForm.findElement(By.css('input[type="text"]'));
            await inputField.sendKeys('Create a test about the Inca Empire');

            // Find and click send button
            const sendButton = await driver.findElement(By.id('send'));
            await sendButton.click();

            // Wait for response with longer timeout
            await driver.sleep(7000);

            // Check for message response
            const messages = await driver.wait(
                until.elementsLocated(By.css('#message .bg-neutral-900')),
                20000,
                'No chat messages found'
            );
            assert.ok(messages.length > 0, 'No messages appeared');

        } catch (error) {
            console.error('Error in chatbot test:', error);
            throw error;
        }
    });

    it('should test typing functionality', async function() {
        try {
            // Navigate to chatbot page
            await driver.get(`${baseUrl}/Chatbot`);
            await driver.sleep(3000);

            // Request a typing test
            const inputForm = await driver.wait(
                until.elementLocated(By.css('form.bg-neutral-900')),
                15000,
                'Input form not found'
            );
            const inputField = await inputForm.findElement(By.css('input[type="text"]'));
            await inputField.sendKeys('Create a short typing test about cats');
            
            const sendButton = await driver.findElement(By.id('send'));
            await sendButton.click();
            
            // Wait for typing test to appear
            await driver.sleep(5000);
            
            // Find and click the typing test area
            const typingTest = await driver.wait(
                until.elementLocated(By.id('typingtest')),
                15000,
                'Typing test area not found'
            );
            await typingTest.click();

            // Get all words in the test
            const words = await driver.findElements(By.css('.word'));
            
            // Type each word
            for (const word of words) {
                // Get letters of current word
                const letters = await word.findElements(By.css('.letter'));
                
                // Type each letter in the word
                for (const letter of letters) {
                    const letterText = await letter.getText();
                    await driver.actions()
                        .sendKeys(letterText)
                        .perform();
                    await driver.sleep(100);
                }
                
                // Add space after each word (except the last word)
                if (words.indexOf(word) < words.length - 1) {
                    await driver.actions()
                        .sendKeys(' ')
                        .perform();
                    await driver.sleep(100);
                }
            }

            // Verify completion
            const completedWords = await driver.findElements(
                By.css('.word:not(.current) .letter.correct')
            );
            assert.ok(completedWords.length > 0, 'No words were typed correctly');

        } catch (error) {
            console.error('Error in typing test:', error);
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});

