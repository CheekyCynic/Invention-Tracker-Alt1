// Initialize chatbox reader
const reader = new alt1.ChatboxReader();
reader.readargs = {
    colors: [alt1.chatColor.system, alt1.chatColor.game] // capture system/game messages
};

// Component stats
const componentStats = {
    common: 0,
    uncommon: 0,
    rare: 0,
    junk: 0
};

// Rare components list for alerts
const rareComponents = ["Flickerfish", "Stardust", "Quantum Gear"]; // example names

// Tracking timing for per-hour calculations
let startTime = Date.now();

// Poll the chatbox every 500ms
setInterval(() => {
    const lines = reader.read();
    if (!lines) return;

    lines.forEach(line => {
        const text = line.text;
        console.log("Detected line:", text); // debug logging

        // Example parsing: adjust regex to match actual in-game messages
        if (/Scavenging yields/.test(text) || /Spring Cleaner/.test(text)) {
            if (/common/i.test(text)) componentStats.common++;
            else if (/uncommon/i.test(text)) componentStats.uncommon++;
            else if (/rare/i.test(text)) {
                componentStats.rare++;
                // Alert for rare components
                rareComponents.forEach(rc => {
                    if (text.includes(rc)) alert(`Rare component obtained: ${rc}`);
                });
            }
            else if (/junk/i.test(text)) componentStats.junk++;
        }
    });

    updateUI();
}, 500);

// Update UI with stats
function updateUI() {
    const statsDiv = document.getElementById("component-stats");
    if (!statsDiv) return;

    // Calculate elapsed time in hours
    const elapsedHours = (Date.now() - startTime) / (1000 * 60 * 60);

    // Components per hour
    const perHour = {
        common: (componentStats.common / elapsedHours).toFixed(2),
        uncommon: (componentStats.uncommon / elapsedHours).toFixed(2),
        rare: (componentStats.rare / elapsedHours).toFixed(2),
        junk: (componentStats.junk / elapsedHours).toFixed(2)
    };

    // Drop/proc rate percentages
    const total = componentStats.common + componentStats.uncommon + componentStats.rare + componentStats.junk;
    const procRate = total ? {
        common: ((componentStats.common / total) * 100).toFixed(1),
        uncommon: ((componentStats.uncommon / total) * 100).toFixed(1),
        rare: ((componentStats.rare / total) * 100).toFixed(1),
        junk: ((componentStats.junk / total) * 100).toFixed(1)
    } : {common:0, uncommon:0, rare:0, junk:0};

    statsDiv.innerHTML = `
        <b>Components:</b><br>
        Common: ${componentStats.common} (${perHour.common}/hr, ${procRate.common}%)<br>
        Uncommon: ${componentStats.uncommon} (${perHour.uncommon}/hr, ${procRate.uncommon}%)<br>
        Rare: ${componentStats.rare} (${perHour.rare}/hr, ${procRate.rare}%)<br>
        Junk: ${componentStats.junk} (${perHour.junk}/hr, ${procRate.junk}%)
    `;
}

// Optional: reset tracker
function resetStats() {
    for (let key in componentStats) componentStats[key] = 0;
    startTime = Date.now();
}
