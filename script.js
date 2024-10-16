document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const hunger = document.getElementById('hunger');
    const energy = document.getElementById('energy');
    const money = document.getElementById('money');

    let hungerLevel = 100;
    let energyLevel = 100;
    let moneyLevel = 0;

    function updateStatus() {
        hunger.textContent = hungerLevel;
        energy.textContent = energyLevel;
        money.textContent = moneyLevel;
    }

    function decreaseHunger() {
        hungerLevel -= 1;
        if (hungerLevel < 0) hungerLevel = 0;
        updateStatus();
    }

    function decreaseEnergy() {
        energyLevel -= 1;
        if (energyLevel < 0) energyLevel = 0;
        updateStatus();
    }

    document.getElementById('eat').addEventListener('click', () => {
        hungerLevel += 20;
        if (hungerLevel > 100) hungerLevel = 100;
        updateStatus();
    });

    document.getElementById('sleep').addEventListener('click', () => {
        energyLevel += 20;
        if (energyLevel > 100) energyLevel = 100;
        updateStatus();
    });

    document.getElementById('work').addEventListener('click', () => {
        moneyLevel += 10;
        hungerLevel -= 10;
        energyLevel -= 10;
        if (hungerLevel < 0) hungerLevel = 0;
        if (energyLevel < 0) energyLevel = 0;
        updateStatus();
    });

    setInterval(decreaseHunger, 1000);
    setInterval(decreaseEnergy, 1000);

    updateStatus();
});
