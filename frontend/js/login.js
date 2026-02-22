function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/api/provider/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {
            localStorage.setItem("provider_id", data.provider_id);
            localStorage.setItem("provider_name", data.provider_name);

            window.location.href = "provider.html";
        } else {
            alert("Invalid Credentials");
        }

    })
    .catch(err => console.error(err));
}

function logout() {
    localStorage.removeItem("provider_id");
    localStorage.removeItem("provider_name");
    window.location.href = "provider_login.html";
}