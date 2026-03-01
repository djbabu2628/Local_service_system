

if (!localStorage.getItem("user_id")) {
    window.location.href = "user_login.html";
}

// 🔐 Protect dashboard
if (!localStorage.getItem("user_id")) {
    window.location.href = "user_login.html";
}

// Show user name
document.addEventListener("DOMContentLoaded", function () {
    const name = localStorage.getItem("user_name");
    document.getElementById("userName").innerText = name;
});

function goToEmergency() {
    window.location.href = "emergency.html";
}

function goToTrack() {
    window.location.href = "track.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}