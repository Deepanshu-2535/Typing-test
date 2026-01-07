//import data from './data.json' with { type: 'json' };
let data;
const output = document.getElementById("text");
let textId = "";
let text = "";
let charIndex = 0;
let mistakes = 0;
let timeLeft = 60;
let timer = 0;
let mode = "";
let difficulty = "";
let timeLeftInterval;
let timerInterval;
let started = false;
let totalchars = 0;
let accuracy = 100;
let wpm = 0;
let personalBest = window.localStorage.getItem("personalBest") || 0;
console.log(personalBest);
document.addEventListener("keydown", handleKeypress);
document.addEventListener("DOMContentLoaded", async function () {
	const res = await fetch("./data.json");
	data = await res.json();
	difficulty = "easy";
	mode = "timed";
	document.getElementById("personal-best").innerText = Math.round(personalBest);
	displayText("easy", "timed");
});
function changeMode(e) {
	mode = e.target.value;
	displayText(difficulty, mode);
}
function changeDifficulty(e) {
	difficulty = e.target.value;
	displayText(difficulty, mode);
}

function displayText(difficulty, mode) {
	started = false;
	charIndex = 0;
	mistakes = 0;
	totalchars = 0;
	accuracy = 100;
	wpm = 0;
	document.getElementById("wpm").innerText = wpm.toFixed(2);
	document.getElementById("accuracy").innerText = accuracy.toFixed(2);
	clearInterval(timeLeftInterval);
	clearInterval(timerInterval);
	if (mode === "timed") {
		timeLeft = 60;
		document.getElementById("time").innerText = timeLeft;
	} else {
		timer = 0;
		document.getElementById("time").innerText = timer;
	}
	const textArray = data[difficulty];
	const randomNumber = Math.floor(Math.random() * 10);
	textId = textArray[randomNumber].id;
	text = textArray[randomNumber].text;
	output.innerHTML = "";
	text.split("").forEach((char) => {
		const span = document.createElement("span");
		span.innerText = char;
		span.classList.add("char");
		output.appendChild(span);
	});
	console.log(text);
}
function handleTimers(mode) {
	if (!started) {
		started = true;
	}
	if (mode === "timed" && started) {
		timeLeftInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft === 0) {
				endGame();
			}
			document.getElementById("time").innerText = timeLeft;
			wpm = totalchars / 5 / ((60 - timeLeft) / 60);
			document.getElementById("wpm").innerText = wpm.toFixed(2);
		}, 1000);
	} else if (mode === "passage" && started) {
		timerInterval = setInterval(() => {
			timer++;
			document.getElementById("time").innerText = timer;
			wpm = totalchars / 5 / (timer / 60);
			document.getElementById("wpm").innerText = wpm.toFixed(2);
		}, 1000);
	}
}
function handleKeypress(e) {
	if (!started) {
		handleTimers(mode);
	}
	const spans = document.querySelectorAll(".char");
	if (e.key == "Backspace") {
		if (charIndex > 0) {
			spans[charIndex].classList.remove("active");
			charIndex--;
			spans[charIndex].classList.remove("incorrect", "correct");
			spans[charIndex].classList.add("active");
		} else {
			return;
		}
	}
	if (e.key.length > 1) {
		return;
	}
	totalchars++;
	if (spans[charIndex].innerText === e.key) {
		spans[charIndex].classList.add("correct");
	} else {
		mistakes++;
		spans[charIndex].classList.add("incorrect");
	}
	spans[charIndex].classList.remove("active");
	charIndex++;
	console.log(charIndex + " " + spans.length);
	if (charIndex >= spans.length) {
		endGame();
	} else {
		spans[charIndex].classList.add("active");
	}
	accuracy = ((totalchars - mistakes) / totalchars) * 100;
	document.getElementById("accuracy").innerText = accuracy.toFixed(2);
}
function endGame() {
	clearInterval(timeLeftInterval);
	clearInterval(timerInterval);
	if (wpm > personalBest) {
		console.log("added");
		window.localStorage.setItem("personalBest", wpm);
	}
	window.localStorage.setItem("wpm", wpm);
	window.localStorage.setItem("accuracy", accuracy);
	window.localStorage.setItem("totalchars", totalchars);
	window.localStorage.setItem("mistakes", mistakes);
	window.location.href = "results.html";
}
function restart() {
	displayText(difficulty, mode);
}
window.changeDifficulty = changeDifficulty;
window.changeMode = changeMode;
window.restart = restart;
