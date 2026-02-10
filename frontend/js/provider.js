function loadEmergencies() {
    const serviceType = document.getElementById("serviceType").value;

    fetch(`http://127.0.0.1:5000/api/emergency/${serviceType}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("requestList");
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerText = "No emergency requests.";
                return;
            }

            data.forEach(req => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <p>
                        <b>Name:</b> ${req[1]} <br>
                        <b>Phone:</b> ${req[2]} <br>
                        <b>Problem:</b> ${req[4]}
                    </p>
                    <button onclick="acceptRequest(${req[0]})">Accept</button>
                    <hr>
                `;
                container.appendChild(div);
            });
        })
        .catch(err => console.error(err));
}

function acceptRequest(requestId) {
    // TEMP: provider id hardcoded (later login se aayega)
    const providerId = 1;

    fetch("http://127.0.0.1:5000/api/accept", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            request_id: requestId,
            provider_id: providerId
        })
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message);
        loadEmergencies();
    })
    .catch(err => console.error(err));
}
