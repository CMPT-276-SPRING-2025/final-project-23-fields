import { By, Builder, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from 'assert';

describe('RoTypeAI Website Tests', function() {
    let driver;

    before(async function() {
        const options = new Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--remote-debugging-port=9222');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    it('should load home page and verify elements', async function() {
        const baseUrl = process.env.STAGING_URL || 'http://localhost:5173';
        await driver.get(baseUrl);
        console.log('Navigating to:', baseUrl);

        const homeTitle = await driver.getTitle();
        console.log('Home Page title is:', homeTitle);
        assert.equal(homeTitle, "RoTypeAI");

        const howToUseButton = await driver.findElement(By.id("howtouse"));
        assert.ok(howToUseButton, "How to Use button is missing");

        const jumpInButton = await driver.findElement(By.id("jumpin"));
        assert.ok(jumpInButton, "Jump In button is missing");
    });

    it('should navigate through tutorial', async function() {
        const howToUseButton = await driver.findElement(By.id("howtouse"));
        await howToUseButton.click();
        await driver.wait(until.urlContains('/Tutorial'), 5000);
        
        for(let i = 0; i < 5; i++) {
            const nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
            await nextButton.click();
            await driver.sleep(1000);
        }
    });

    it('should test chatbot functionality', async function() {
        const nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await nextButton.click();
        await driver.wait(until.urlContains('/Chatbot'), 5000);

        const inputField = await driver.findElement(By.css('input[placeholder="Ask RoTypeAI"]'));
        await driver.sleep(2000);
        await inputField.sendKeys("Create a test about the Inca Empire");
        
        const sendButton = await driver.findElement(By.id('send'));
        await sendButton.click();
        
        await driver.sleep(5000);
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

"scripts": {
  "test": "mocha selenium-tests/test.spec.js --timeout 60000"
}