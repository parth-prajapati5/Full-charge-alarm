
initBattery();

function initBattery() {
    const batteryLiquid = document.querySelector('.level'),
        batteryStatus = document.querySelector('.battery_status'),
        batteryPercentage = document.querySelector('.battery__percentage');
    const stop = document.getElementById('stop');
    const alertSound = document.getElementById('alertSound');

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
                const battery_Liquid = document.querySelector('.level'); 
                battery_Liquid.style.background = '#2bf34c';

            } else { /* If it's not loading, don't show anything. */
                batteryStatus.innerHTML = '';
            }
            if (level == 100 && !alertSound.paused) {
                return; // Prevent multiple plays of the same sound
            } else if (level == 100) {
                alertSound.play().catch(error => {
                    alert("Error playing audio:", error);
                });
            }

            /* Change the colors of the battery and remove the other colors */
            if (level <= 20) {
                batteryLiquid.style.background = 'red';
            } else if (level <= 40) {
                batteryLiquid.style.background = 'linear-gradient(to right, green, lightgreen)';
                
            } else if (level <= 80) {
                batteryLiquid.style.background = 'linear-gradient(to right, red, orange)';
            } else {
                batteryLiquid.style.background = '#2bf34c';
            }
        };

        updateBattery();

        /* Battery status events */
        batt.addEventListener('chargingchange', updateBattery);
        batt.addEventListener('levelchange', updateBattery);
        stop.addEventListener('click', () => {
            alertSound.pause();
            alertSound.currentTime = 0; // Reset to the beginning
        });
    });
}
