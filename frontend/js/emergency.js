document.getElementById("emergencyForm").addEventListener("submit", function (e) {
    e.preventDefault(); // page reload stop

    const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        service_type: document.getElementById("service_type").value,
        description: document.getElementById("description").value
    };

    fetch("http://127.0.0.1:5000/api/emergency", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById("responseMsg").innerText = result.message;
        document.getElementById("emergencyForm").reset();
    })
    .catch(error => {
        document.getElementById("responseMsg").innerText = "Error sending request";
        console.error(error);
    });
});
