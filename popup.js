// 1. Function to extract dates from the parkrun roster table
function getRosterDates() {
    const table = document.getElementById("rosterTable");
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll("thead th"));
    return headers
        .map((th, index) => {
            const text = th.innerText.trim();
            if (index === 0 && !text) return null;
            return {
                date: text || `Col ${index}`,
                index: index + 1,
            };
        })
        .filter((item) => item !== null);
}

// 2. Function to handle the printing, layout logic, and the automatic reload
function executePrintThenReload(indicesToHide, totalSelected) {
    // Create a temporary style tag for column hiding and orientation
    const colStyle = document.createElement("style");
    colStyle.id = "print-column-hider";

    let cssRules = "";

    // Rule for Orientation: Portrait for 1 column, Landscape for more
    const orientation = totalSelected === 1 ? "portrait" : "landscape";
    cssRules += `@media print { @page { size: ${orientation}; margin: 1cm; } } `;

    // Create CSS rules for all columns the user UNCHECKED
    indicesToHide.forEach((idx) => {
        cssRules += `#rosterTable th:nth-child(${idx}), #rosterTable td:nth-child(${idx}) { display: none !important; } `;
    });

    colStyle.innerHTML = cssRules;
    document.head.appendChild(colStyle);

    // Set up the listener to reload the page once the print dialog closes
    window.addEventListener(
        "afterprint",
        () => {
            window.location.reload();
        },
        { once: true }
    );

    // Trigger the print dialog
    window.print();
}

// 3. Helper function to update print button state
function updatePrintButtonState() {
    const checkboxes = document.querySelectorAll(".date-check");
    const printBtn = document.getElementById("printBtn");
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    printBtn.disabled = !anyChecked;
}

// 4. Popup UI Initialization
window.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getRosterDates,
    });

    const dates = results[0]?.result || [];
    const container = document.getElementById("columnList");

    if (dates.length === 0) {
        container.innerHTML = "No roster found on this page.";
        return;
    }

    container.innerHTML = "";
    dates.forEach((item, idx) => {
        const div = document.createElement("div");
        div.style.cssText =
            "display: flex; align-items: center; margin-bottom: 5px; font-size: 13px;";
        const isChecked = idx === 0 ? "checked" : "";
        div.innerHTML = `<input type="checkbox" ${isChecked} class="date-check" data-index="${item.index}" style="margin-right: 8px;"> ${item.date}`;
        container.appendChild(div);
    });
    
    // Add change listeners to all checkboxes
    document.querySelectorAll(".date-check").forEach(cb => {
        cb.addEventListener("change", updatePrintButtonState);
    });
    
    // Set initial button state
    updatePrintButtonState();
});

// 5. Toggle All/None Button Listener
document.getElementById("toggleBtn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".date-check");
    const toggleBtn = document.getElementById("toggleBtn");
    
    if (toggleBtn.textContent === "Select All") {
        checkboxes.forEach(cb => cb.checked = true);
        toggleBtn.textContent = "Select None";
    } else {
        checkboxes.forEach(cb => cb.checked = false);
        toggleBtn.textContent = "Select All";
    }
    
    updatePrintButtonState();
});

// 6. Print Button Listener
document.getElementById("printBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    const checkboxes = document.querySelectorAll(".date-check");
    const hiddenIndices = [];
    let totalSelected = 0;

    checkboxes.forEach((cb) => {
        if (!cb.checked) {
            hiddenIndices.push(parseInt(cb.getAttribute("data-index")));
        } else {
            totalSelected++;
        }
    });

    // Inject the main stylesheet (hides header, intro text, etc.)
    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["print-stylesheet.css"],
    });

    // Run the print command with the hidden indices and the count of selected columns
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: executePrintThenReload,
        args: [hiddenIndices, totalSelected],
    });
});
