document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("serviceSelect");

    fetchRequests(select.value);

    select.addEventListener("change", function() {
        fetchRequests(select.value);
        

     ; // every 10 seconds
    });
});

function checkAvailability() {
    fetch("http://127.0.0.1:5000/api/provider/1")
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
    fetch(`http://127.0.0.1:5000/api/emergency/${serviceType}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const requestList = document.getElementById("requestList");

            if (data.length === 0) {
                requestList.innerHTML = `
                    <div class="request-item">
                        <h4>No Emergency Requests</h4>
                        <p>Currently no active jobs available.</p>
                    </div>
                `;
            } else {
                requestList.innerHTML = "";
                data.forEach(item => {
    requestList.innerHTML += `
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
        });
}

function acceptJob(event, id) {

    fetch("http://127.0.0.1:5000/api/accept", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            request_id: id,
            provider_id: 1
        })
    })
    .then(res => res.json())
    .then(data => {

        const button = event.target;
        const card = button.closest(".request-item");

        button.innerText = "Complete Job";
        button.classList.remove("accept-btn");
        button.classList.add("complete-btn");

        button.onclick = function(e) {
            completeJob(e, id);
        };

    })
    .catch(err => console.error(err));
}


function completeJob(event, id) {

    fetch("http://127.0.0.1:5000/api/complete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            request_id: id,
            provider_id: 1
        })
    })
    .then(res => res.json())
    .then(data => {

        const card = event.target.closest(".request-item");

        card.classList.add("fade-out");

        setTimeout(() => {
            card.remove();
        }, 400);

        alert("Job Completed! You are now Available.");

    })
    .catch(err => console.error(err));
}

