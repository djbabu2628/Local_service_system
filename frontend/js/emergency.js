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
            const responseMsg = document.getElementById("responseMsg");

            responseMsg.style.display = "block";
            responseMsg.innerText = result.message;

            setTimeout(() => {
                responseMsg.style.display = "none";
            }, 3000);

            form.reset();
        })
        .catch(error => {
            console.error("Error:", error);
        });

    });

});
