let previousRequestCount = 0;
let firstLoad = true;

let CURRENT_PROVIDER_ID = localStorage.getItem("provider_id");

if (!CURRENT_PROVIDER_ID) {
    window.location.href = "provider_login.html";
}

let providerName = localStorage.getItem("provider_name");

if (providerName) {
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("providerName").innerText =
            "Logged in as: " + providerName;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("serviceSelect");

    fetchRequests(select.value);

    select.addEventListener("change", function() {
        fetchRequests(select.value);
         });
        setInterval(() => {
            fetchRequests(select.value);
        }, 10000); // every 10 seconds

      // every 10 seconds
});

function checkAvailability() {
    fetch(`http://127.0.0.1:5000/api/provider/${CURRENT_PROVIDER_ID}`)
        .then(res => res.json())
        .then(data => {
            if (data.availability === "BUSY") {
                document.getElementById("requestList").innerHTML = `
                    <div class="request-item">
                        <h4>You are currently busy</h4>
                        <p>Complete your current job before accepting new ones.</p>
                    </div>
                `;
            }
        });
}


function fetchRequests(serviceType) {

    fetch(`http://127.0.0.1:5000/api/provider/jobs/${CURRENT_PROVIDER_ID}/${serviceType}`)
        .then(res => res.json())
        .then(data => {

            const pendingDiv = document.getElementById("pendingJobs");
            const activeDiv = document.getElementById("activeJob");

            // --------------------
            // Pending Jobs
            // --------------------
            if (data.pending.length === 0) {
                pendingDiv.innerHTML = `
                    <div class="request-item">
                        <p>No available jobs</p>
                    </div>
                `;
            } else {
                pendingDiv.innerHTML = "";
                data.pending.forEach(item => {
                    pendingDiv.innerHTML += `
                        <div class="request-item">
                            <h4>${item[1]}</h4>
                            <p><strong>Phone:</strong> ${item[2]}</p>
                            <p>${item[4]}</p>
                            <button class="accept-btn" onclick="acceptJob(event, ${item[0]})">
                                Accept Job
                            </button>
                        </div>
                    `;
                });
            }

            // --------------------
            // Active Job
            // --------------------
            if (data.active) {
                activeDiv.innerHTML = `
                    <div class="request-item active-highlight">
                        <h4>${data.active[1]}</h4>
                        <p><strong>Phone:</strong> ${data.active[2]}</p>
                        <p>${data.active[4]}</p>
                        <button class="complete-btn" onclick="completeJob(event, ${data.active[0]})">
                            Complete Job
                        </button>
                    </div>
                `;
            } else {
                activeDiv.innerHTML = `
                    <div class="request-item">
                        <p>No active job</p>
                    </div>
                `;
            }

        })
        .catch(err => console.error(err));
}

function acceptJob(event, id) {

    const button = event.target;
    button.disabled = true;

    fetch("http://127.0.0.1:5000/api/accept", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            request_id: id,
            provider_id: CURRENT_PROVIDER_ID
        })
    })
    .then(res => res.json())
    .then(data => {
        showToast("Job Accepted Successfully!", "success");
        

        button.innerText = "Complete Job";
        button.classList.remove("accept-btn");
        button.classList.add("complete-btn");

        button.onclick = function(e) {
            completeJob(e, id);
        };

    })
}


function completeJob(event, id) {

    fetch("http://127.0.0.1:5000/api/complete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            request_id: id,
            provider_id: CURRENT_PROVIDER_ID
        })
    })
    .then(res => res.json())
    .then(data => {

        const card = event.target.closest(".request-item");

        card.classList.add("fade-out");

        setTimeout(() => {
            card.remove();
        }, 400);

        showToast("Job Completed! You are now Available.", "success");


    })
    .catch(err => console.error(err));
}

function logout() {
    localStorage.removeItem("provider_id");
    localStorage.removeItem("provider_name");
    window.location.href = "provider_login.html";
}