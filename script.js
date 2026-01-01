// Check Alt1 API availability
if (typeof alt1 === "undefined" || typeof alt1.ChatboxReader === "undefined") {
    alert("Alt1 API not detected. Make sure the tracker is installed as an Alt1 app and RuneScape is running.");
} else {
    console.log("Alt1 API detected. Initializing Invention Tracker...");

    const reader = new alt1.ChatboxReader();
    reader.readargs = {};

    const componentStats = { common:0, uncommon:0, rare:0, junk:0 };
    const rareComponents = ["Flickerfish", "Stardust", "Quantum Gear"];

    let startTime = Date.now();

    setInterval(() => {
        const lines = reader.read();
        if (!lines || lines.length === 0) return;

        lines.forEach(line => {
            const text = line.text;
            console.log("[CHAT]", text);

            if (/Scavenging yields/.test(text) || /Spring Cleaner/.test(text)) {
                if (/common/i.test(text)) componentStats.common++;
                else if (/uncommon/i.test(text)) componentStats.uncommon++;
                else if (/rare/i.test(text)) {
                    componentStats.rare++;
                    rareComponents.forEach(rc => {
                        if (text.includes(rc)) alert(`Rare component obtained: ${rc}`);
                    });
                }
                else if (/junk/i.test(text)) componentStats.junk++;
            }
        });

        updateUI();
    }, 500);

    function updateUI() {
        const statsDiv = document.getElementById("component-stats");
        if (!statsDiv) return;

        const elapsedHours = (Date.now() - startTime)/(1000*60*60);

        const perHour = {
            common: (componentStats.common/elapsedHours).toFixed(2),
            uncommon: (componentStats.uncommon/elapsedHours).toFixed(2),
            rare: (componentStats.rare/elapsedHours).toFixed(2),
            junk: (componentStats.junk/elapsedHours).toFixed(2)
        };

        const total = componentStats.common + componentStats.uncommon + componentStats.rare + componentStats.junk;
        const procRate = total ? {
            common: ((componentStats.common/total)*100).toFixed(1),
            uncommon: ((componentStats.uncommon/total)*100).toFixed(1),
            rare: ((componentStats.rare/total)*100).toFixed(1),
            junk: ((componentStats.junk/total)*100).toFixed(1)
        } : {common:0, uncommon:0, rare:0, junk:0};

        statsDiv.innerHTML = `
            <b>Components:</b><br>
            Common: ${componentStats.common} (${perHour.common}/hr, ${procRate.common}%)<br>
            Uncommon: ${componentStats.uncommon} (${perHour.uncommon}/hr, ${procRate.uncommon}%)<br>
            Rare: ${componentStats.rare} (${perHour.rare}/hr, ${procRate.rare}%)<br>
            Junk: ${componentStats.junk} (${perHour.junk}/hr, ${procRate.junk}%)
        `;
    }

    window.resetStats = function() {
        for (let key in componentStats) componentStats[key] = 0;
        startTime = Date.now();
    };
}
