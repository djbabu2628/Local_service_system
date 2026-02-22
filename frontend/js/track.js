let currentPhone = "";
let lastStatus = "";
let pollIntervalId = null;

function trackRequest() {

    const phone = document.getElementById("phone").value.trim();

    if (!phone) {
        showToast("Enter phone number first", "error");
        return;
    }

    // Restart tracking cleanly if user triggers it again.
    if (pollIntervalId) {
        clearInterval(pollIntervalId);
    }

    currentPhone = phone;
    lastStatus = "";

    fetchStatus(); // first fetch

    // Auto refresh every 5 seconds
    pollIntervalId = setInterval(fetchStatus, 5000);
}

function fetchStatus() {

    if (!currentPhone) return;

    fetch(`http://127.0.0.1:5000/api/track/${currentPhone}`)
        .then(res => res.json())
        .then(data => {

            console.log(data); // debug

            const box = document.getElementById("statusBox");

            if (data.message) {
                box.innerHTML = `
                    <div style="padding:15px; background:#444; color:white; border-radius:10px;">
                        No request found for this number.
                    </div>
                `;
                return;
            }

            let statusText = "";
            let badgeColor = "";

            if (data.status === "PENDING") {
                statusText = "Waiting for provider...";
                badgeColor = "orange";
            }

            if (data.status === "ASSIGNED") {
                statusText = `Assigned to: ${data.provider_name}`;
                badgeColor = "dodgerblue";
            }

            if (data.status === "COMPLETED") {
                statusText = "Service completed.";
                badgeColor = "green";
            }

            box.innerHTML = `
                <div style="padding:15px; border-radius:10px; background:${badgeColor}; color:white;">
                    ${statusText}
                </div>
            `;

            // Toast only when status changes
            if (lastStatus && lastStatus !== data.status) {
                showToast("Status Updated!", "success");
            }

            lastStatus = data.status;

        })
        .catch(err => console.error(err));
}
