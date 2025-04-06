import { By, Builder, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';

describe('RoTypeAI Website Tests', function() {
    let driver;
    
    // Increase the timeout for all tests
    this.timeout(60000);

    before(async function() {
        const options = new Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');

        // Try to connect to ChromeDriver with retries
        let retries = 3;
        while (retries > 0) {
            try {
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
                break;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log('Retrying ChromeDriver connection...');
            }
        }

        // Set implicit wait time
        await driver.manage().setTimeouts({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000 
        });
    });

    it('should load home page and verify elements', async function() {
        const baseUrl = process.env.STAGING_URL || 'http://localhost:5173';
        console.log('Testing URL:', baseUrl);

        // Retry logic for connection issues
        let retries = 3;
        while (retries > 0) {
            try {
                await driver.get(baseUrl);
                break;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        const homeTitle = await driver.getTitle();
        console.log('Home Page title:', homeTitle);
        assert.equal(homeTitle, "RoTypeAI");

        // Wait for elements to be present
        const howToUseButton = await driver.wait(until.elementLocated(By.id("howtouse")), 10000);
        const jumpInButton = await driver.wait(until.elementLocated(By.id("jumpin")), 10000);
        
        assert.ok(await howToUseButton.isDisplayed(), "How to Use button is not visible");
        assert.ok(await jumpInButton.isDisplayed(), "Jump In button is not visible");
    });

    it('should navigate through tutorial', async function() {
        // Click "How to Use" button and wait for navigation
        const howToUseButton = await driver.findElement(By.id("howtouse"));
        await howToUseButton.click();
        await driver.wait(until.urlContains('/Tutorial'), 10000);
        
        // Click through tutorial slides
        for(let i = 0; i < 5; i++) {
            await driver.sleep(1000); // Wait for animation
            const nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
            await nextButton.click();
        }
        await driver.sleep(1000); // Wait for last animation
    });

    it('should test chatbot functionality', async function() {
        // Navigate to chatbot
        const nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await nextButton.click();
        await driver.wait(until.urlContains('/Chatbot'), 10000);
        await driver.sleep(2000); // Wait for page load

        // Find and interact with chatbot
        const inputField = await driver.findElement(By.css('input[placeholder="Ask RoTypeAI"]'));
        await driver.sleep(2000);
        await inputField.sendKeys("Create a test about the Inca Empire");
        
        const sendButton = await driver.findElement(By.id('send'));
        await sendButton.click();
        
        // Wait for and verify bot response
        await driver.sleep(5000); // Wait for API response
        const messages = await driver.findElements(By.css('#message .bg-neutral-900'));
        const lastMessage = messages[messages.length - 1];
        const botResponse = await lastMessage.getText();
        assert.ok(botResponse.length > 0, "Bot did not respond");
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});

