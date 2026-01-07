document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("wpm").innerText = Math.round(window.localStorage.getItem("wpm"));
	document.getElementById("accuracy").innerText = Math.round(window.localStorage.getItem("accuracy"));
	document.getElementById("total-chars").innerText = Math.round(window.localStorage.getItem("totalchars"));
	document.getElementById("mistakes").innerText = Math.round(window.localStorage.getItem("mistakes"));
	document.getElementById("personal-best").innerText = Math.round(window.localStorage.getItem("personalBest"));
});
const button = document.getElementById("btn");
button.addEventListener("click", () => {
	window.location.href = "home.html";
});
