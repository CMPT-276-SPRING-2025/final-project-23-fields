import { By, Builder, until } from 'selenium-webdriver';
import assert from 'assert';

(async function testSuite() {
    let driver; 

    try {
        // Setup Chrome in headless mode for CI
        const chrome = require('selenium-webdriver/chrome');
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Use staging URL if available, otherwise use localhost
        const baseUrl = process.env.NODE_ENV === 'staging' 
            ? process.env.STAGING_URL 
            : 'http://localhost:5173';

        console.log("BLACK BOX TESTING")
        // Test Home Page
        await driver.get(baseUrl);
        let homeTitle = await driver.getTitle();
        console.log('Home Page title is:', homeTitle);
        assert.equal(homeTitle, "RoTypeAI");

        // Verify "How to Use" button
        let howToUseButton = await driver.findElement(By.id("howtouse"));
        assert.ok(howToUseButton, "How to Use button is missing");

        // Verify "Jump In" button
        let jumpInButton = await driver.findElement(By.id("jumpin"));
        assert.ok(jumpInButton, "Jump In button is missing");
        await driver.sleep(1000);

        // Navigate to Tutorial Page
        await howToUseButton.click();
        await driver.wait(until.urlContains('/Tutorial'), 5000);
        let tutorialUrl = await driver.getCurrentUrl();
        console.log('Navigated to Tutorial Page:', tutorialUrl);
        assert.ok(tutorialUrl.includes('/Tutorial'));
        await driver.sleep(1000);

        // Test Tutorial Page
        let tutorialTitle = await driver.getTitle();
        console.log('Tutorial Page title is:', tutorialTitle);
        assert.equal(tutorialTitle, "RoTypeAI");
        await driver.sleep(1000);

        // Test "Next" button
        let nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await nextButton.click();
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');
        await driver.sleep(1000);

        // Test "Back" button
        let backButton = await driver.findElement(By.xpath("//button[contains(., 'Back')]"));
        await backButton.click();
        await driver.sleep(1000);
        console.log('Clicked Back button on Tutorial Page');

        // Go back to home
        backButton = await driver.findElement(By.xpath("//button[contains(., 'Back')]"));
        await backButton.click();
        await driver.sleep(1000);
        console.log('Clicked Back button to return to Home Page');

        // Re-locate the "How to Use" button after navigating back to the home page
        howToUseButton = await driver.findElement(By.id("howtouse"));

        // Go back to tutorial
        await howToUseButton.click();
        await driver.wait(until.urlContains('/Tutorial'), 5000);
        await driver.sleep(1000);
        console.log('Navigated to Tutorial Page:', tutorialUrl);
        
        // Go through tutorial images
        nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await nextButton.click(); 
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');
        await nextButton.click(); 
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');
        await nextButton.click(); 
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');
        await nextButton.click(); 
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');
        await nextButton.click(); 
        await driver.sleep(1000);
        console.log('Clicked Next button on Tutorial Page');

        // Navigate to Chatbot
        await nextButton.click(); 
        await driver.wait(until.urlContains('/Chatbot'), 5000);
        let chatbotUrl = await driver.getCurrentUrl();
        console.log('Navigated to Chatbot Page:', chatbotUrl);
        assert.ok(chatbotUrl.includes('/Chatbot'));

        // Test Chatbot Page
        let chatbotTitle = await driver.getTitle();
        console.log('Chatbot Page title is:', chatbotTitle);
        assert.equal(chatbotTitle, "RoTypeAI");

        // Test sending a message
        let inputField = await driver.findElement(By.css('input[placeholder="Ask RoTypeAI"]'));
        await driver.sleep(5000);
        await inputField.sendKeys("Create a test about the Inca Empire");
        let sendButton = await driver.findElement(By.id('send'));
        await sendButton.click();
        console.log('Sent a message to the chatbot');

        // Wait for and capture the bot's response
        await driver.sleep(5000); // Wait for API response
        let messages = await driver.findElements(By.css('#message .bg-neutral-900'));
        let lastMessage = messages[messages.length - 1];
        let botResponse = await lastMessage.getText();
        console.log('Bot response:', botResponse);
        assert.ok(botResponse.length > 0, "Bot did not respond");
        console.log("ALL TESTS PASS")

    } catch (error) {
        console.error('Error during tests:', error);
    } finally {
        await driver.quit();
    }
})();