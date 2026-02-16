document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("emergencyForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

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
                    showToast("Emergency request sent successfully!", "success");
                    form.reset();
                })
                .catch(error => {
                    showToast("Failed to send request", "error");
                    console.error("Error:", error);
                });


    });

});

