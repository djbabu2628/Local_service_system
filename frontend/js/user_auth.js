localStorage.setItem("user_id", data.user_id);
localStorage.setItem("user_name", data.user_name);

function registerUser() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        showToast("All fields required", "error");
        return;
    }

    fetch("http://127.0.0.1:5000/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Registration successful!", "success");
            setTimeout(() => {
                window.location.href = "user_login.html";
            }, 1500);
        } else {
            showToast(data.error || "Registration failed", "error");
        }
    });
}



function loginUser() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("All fields required", "error");
        return;
    }

    fetch("http://127.0.0.1:5000/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {

            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("user_name", data.user_name);

            showToast("Login successful!", "success");

            setTimeout(() => {
                window.location.href = "user_dashboard.html";
            }, 1500);

        } else {
            showToast("Invalid credentials", "error");
        }
    });
}