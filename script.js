
// Initialize battery monitoring
initBattery();

function initBattery() {
    const batteryLiquid = document.querySelector('.level'),
        batteryStatus = document.querySelector('.battery_status'),
        batteryPercentage = document.querySelector('.battery__percentage');
    const stop = document.getElementById('stop');
    const alertSound = document.getElementById('alertSound');
    let hasPlayedAlert = false; // Track if alert has been played
    
    // Check if battery API is supported
    if (!navigator.getBattery) {
        batteryStatus.innerHTML = 'Battery API not supported';
        return;
    }

    navigator.getBattery().then((batt) => {
        const updateBattery = () => {
            /* ====== Updating the number level of the battery ====== */
            let level = Math.floor(batt.level * 100);
            batteryPercentage.innerHTML = level + '%';

            /* ====== Updating the background level of the battery ====== */
            batteryLiquid.style.height = `${parseInt(batt.level * 100)}%`;

            /* ====== Validate full battery, low battery, and charging status ====== */
            if (level === 100) { /* Validate if the battery is full */
                batteryStatus.innerHTML = `Full battery <i class="fa-solid fa-battery-full fa-rotate-270" style="color: #2bf34c;"></i>`;
                batteryLiquid.style.height = '100%'; /* To hide the ellipse */
            } else if (level <= 20 && !batt.charging) { /* Validate if the battery is low */
                batteryStatus.innerHTML = `Low battery <i class="fa-solid fa-battery-quarter fa-rotate-270" style="color: #fa0000;"></i>`;
            } else if (batt.charging) { /* Validate if the battery is charging */
                batteryStatus.innerHTML = `Charging... <i class="fa-solid fa-bolt-lightning" style="color: #27eb00;"></i>`;

            } else { /* If it's not loading, don't show anything. */
                batteryStatus.innerHTML = '';
            }
            // Play alert sound when battery reaches 100%
            if (level === 100 && !hasPlayedAlert) {
                alertSound.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
                hasPlayedAlert = true;
            } else if (level < 100) {
                hasPlayedAlert = false; // Reset flag when battery goes below 100%
            }

            /* Change the colors of the battery based on level */
            if (level <= 20) {
                batteryLiquid.style.background = '#ff0000'; // Red for low battery
            } else if (level <= 40) {
                batteryLiquid.style.background = '#ff6600'; // Orange for medium-low
            } else if (level <= 60) {
                batteryLiquid.style.background = '#ffff00'; // Yellow for medium
            } else if (level <= 80) {
                batteryLiquid.style.background = '#00ff00'; // Light green for good
            } else {
                batteryLiquid.style.background = '#2bf34c'; // Bright green for full
            }
        };

        updateBattery();

        /* Battery status events */
        batt.addEventListener('chargingchange', updateBattery);
        batt.addEventListener('levelchange', updateBattery);
        stop.addEventListener('click', () => {
            alertSound.pause();
            alertSound.currentTime = 0; // Reset to the beginning
            hasPlayedAlert = false; // Reset alert flag when manually stopped
        });
    }).catch(error => {
        console.error('Error accessing battery:', error);
        batteryStatus.innerHTML = 'Unable to access battery information';
    });
}

