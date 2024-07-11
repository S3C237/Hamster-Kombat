// ==UserScript==
// @name         Hamster Kombat Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.hamsterkombat.io/*
// @version      1.2
// @description  12.06.2024, 21:43:52
// @author       Homous
// @grant        none
// @icon         http://89.106.206.41/homous/HAMSTERICON.png
// @downloadURL  https://raw.githubusercontent.com/amir-homous/Hamster-Kombat/main/hamster-autoclicker.user.js
// @updateURL    https://raw.githubusercontent.com/amir-homous/Hamster-Kombat/main/hamster-autoclicker.user.js
// @homepage     https://github.com/amir-homous/Hamster-Kombat
// ==/UserScript==


(function () {
    // Configuring styles for logs
    const styles = {
        success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    };
    const logPrefix = '%c[HamsterKombatBot] ';

    // Rewriting console.log function to add prefix and styles
    const originalLog = console.log;
    console.log = function () {
        if (typeof arguments[0] === 'string' && arguments[0].includes('[HamsterKombatBot]')) {
            originalLog.apply(console, arguments);
        }
    };

    // Отключение остальных методов консоли для чистоты вывода
    console.error = console.warn = console.info = console.debug = () => { };

    // Disabling other console methods for clear output
    console.clear();
    console.log(`${logPrefix}Starting`, styles.starting);
    console.log(`${logPrefix}Created by https://t.me/mudachyo`, styles.starting);
    console.log(`${logPrefix}Github https://github.com/mudachyo/Hamster-Kombat`, styles.starting);

    // Script settings
    const settings = {
        minEnergy: 25, // Minimum energy required to press a coin
        minInterval: 30, // Minimum interval between clicks in milliseconds
        maxInterval: 100, // Maximum interval between clicks in milliseconds
        minEnergyRefillDelay: 60000, // Minimum delay in milliseconds for energy replenishment (60 seconds)
        maxEnergyRefillDelay: 180000, // maximum delay in milliseconds for energy replenishment (180 seconds)
        maxRetries: 5 // Maximum number of attempts before page reload
    };

    let retryCount = 0;

    // Function to get element location
    function getElementPosition(element) {
        let current_element = element;
        let top = 0, left = 0;
        do {
            top += current_element.offsetTop || 0;
            left += current_element.offsetLeft || 0;
            current_element = current_element.offsetParent;
        } while (current_element);
        return { top, left };
    }

    // Function to generate a random number in a range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function for performing a click with random coordinates
    function performRandomClick() {
        const energyElement = document.getElementsByClassName("user-tap-energy")[0];
        const buttonElement = document.getElementsByClassName('user-tap-button')[0];

        if (!energyElement || !buttonElement) {
            // Element not found, trying to restart the script
            console.log(`${logPrefix}Element not found, retrying...`, styles.error);

            retryCount++;
            if (retryCount >= settings.maxRetries) {
                console.log(`${logPrefix}Max retries reached, reloading page...`, styles.error);
                location.reload();
            } else {
                // Add a 2 second delay before the next attempt
                setTimeout(() => {
                    setTimeout(performRandomClick, getRandomNumber(settings.minInterval, settings.maxInterval));
                }, 2000);
            }
            return;
        }

        retryCount = 0; // Reset the attempt counter when elements are successfully detected
        const energy = parseInt(energyElement.getElementsByTagName("p")[0].textContent.split(" / ")[0]);
        if (energy > settings.minEnergy) {
            // Generation of random coordinates, taking into account the location and size of the button
            let { top, left } = getElementPosition(buttonElement);
            const randomX = Math.floor(left + Math.random() * buttonElement.offsetWidth);
            const randomY = Math.floor(top + Math.random() * buttonElement.offsetHeight);
            // Creating click events at specified coordinates
            const pointerDownEvent = new PointerEvent('pointerdown', { clientX: randomX, clientY: randomY });
            const pointerUpEvent = new PointerEvent('pointerup', { clientX: randomX, clientY: randomY });
            // Performing a click
            buttonElement.dispatchEvent(pointerDownEvent);
            buttonElement.dispatchEvent(pointerUpEvent);

            console.log(`${logPrefix}Button clicked at (${randomX}, ${randomY})`, styles.success);
        } else {
            // Displaying a message about insufficient energy level to the console
            console.log(`${logPrefix}Insufficient energy, pausing script for energy refill.`, styles.info);

            // Generating a random delay value for energy replenishment
            const randomEnergyRefillDelay = getRandomNumber(settings.minEnergyRefillDelay, settings.maxEnergyRefillDelay);
            const delayInSeconds = randomEnergyRefillDelay / 1000;

            // Displaying information about the time until the next launch to the console
            console.log(`${logPrefix}Energy refill delay set to: ${delayInSeconds} seconds.`, styles.info);

            // Set the delay before the next energy check
            setTimeout(performRandomClick, randomEnergyRefillDelay);
            return;
        }
        // Generating the next click at a random interval
        const randomInterval = getRandomNumber(settings.minInterval, settings.maxInterval);
        setTimeout(performRandomClick, randomInterval);
    }

    // Function for clicking the "Thank you, Bybit" button
    function clickThankYouBybitButton() {
        const thankYouButton = document.querySelector('.bottom-sheet-button.button.button-primary.button-large');
        if (thankYouButton) {
            thankYouButton.click();
            console.log(`${logPrefix}'Thank you' button clicked.`, styles.success);
        }
    }

    // Start click execution with a 5 second delay
    setTimeout(() => {
        console.log(`${logPrefix}Script starting after 5 seconds delay...`, styles.starting);
        clickThankYouBybitButton();
        performRandomClick();
    }, 5000); // Delay 5 seconds
})();
