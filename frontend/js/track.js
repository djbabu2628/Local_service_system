function trackRequest() {

    const phone = document.getElementById("phone").value;

    fetch(`http://127.0.0.1:5000/api/track/${phone}`)
        .then(res => res.json())
        .then(data => {

            const box = document.getElementById("statusBox");

            if (data.message) {
                box.style.display = "block";
                showToast("No request found for this number", "error");
                return;
            }

            let statusText = "";

            if (data.status === "PENDING") {
                statusText = "⏳ Waiting for provider...";
            }

            if (data.status === "ASSIGNED") {
                statusText = `🛠 Provider Assigned: ${data.provider_name}`;
            }

            if (data.status === "COMPLETED") {
                statusText = "✅ Job Completed. Thank you!";
            }

            box.style.display = "block";
            box.innerText = statusText;

        })
        .catch(err => console.error(err));
}
