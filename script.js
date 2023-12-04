const box = document.getElementById("box");

var text;
var author;
async function getquote(url) {
  const response = await fetch(url);
  var data = await response.json();
  text = data[0].content;
  author = data[0].author;
  loadPage();
}
getquote("https://api.quotable.io/quotes/random?minLength=200&maxLength=350");

function loadPage() {
  displayText(text);
  document.body.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  document.body.addEventListener("drop", (event) => {
    event.preventDefault();
  });
  const input = document.createElement("input");
  input.onpaste = (e) => e.preventDefault();
  input.setAttribute("id", "userInput");
  input.setAttribute("placeholder", "Click to Start");
  box.appendChild(input);

  input.addEventListener("keyup", compare);
  input.addEventListener("focus", startInterval);

  function displayText(text) {
    const div = document.createElement("div");
    div.setAttribute("id", "text");
    let wordNumber = 1;
    let letterNumber = 1;
    let wordSpan = createWordSpan();

    function createWordSpan() {
      const span = document.createElement("span");
      span.setAttribute("id", "w" + wordNumber);
      return span;
    }

    for (const letter of text) {
      const letterSpan = document.createElement("span");
      letterSpan.innerHTML = letter;
      letterSpan.setAttribute("id", wordNumber + "l" + letterNumber);
      wordSpan.appendChild(letterSpan);
      letterNumber++;

      if (letter === " ") {
        wordNumber++;
        wordSpan = createWordSpan();
        letterNumber = 1;
      }
      div.appendChild(wordSpan);
    }
    box.appendChild(div);
    const authorDiv = document.createElement("div");
    authorDiv.innerHTML = "~ " + author;
    authorDiv.setAttribute("id", "author");

    box.appendChild(authorDiv);
  }

  let wordNum = 1;
  document.getElementById("w" + wordNum).classList.add("underLine");

  function compare() {
    input.value = input.value.trimStart();
    const currentWord = document.getElementById("w" + wordNum);
    currentWord.classList.add("underLine");
    displayColor(currentWord);
    compareSpace(currentWord);
    compareDot(currentWord);
  }
  function displayColor(currentWord) {
    let childNumber = currentWord.childElementCount;
    let inputSubstring = input.value.substring(0, childNumber);
    let prevColor = "greenColor";

    while (childNumber) {
      const letterId = wordNum + "l" + childNumber;
      const letterSpan = document.getElementById(letterId);

      if (childNumber <= input.value.length) {
        const prevLetterId = wordNum + "l" + (childNumber - 1);
        const prevLetterSpan = document.getElementById(prevLetterId);

        // Check if prevLetterSpan is not null
        if (prevLetterSpan) {
          prevColor = prevLetterSpan.classList.contains("redColor")
            ? "redColor"
            : "greenColor";
        }

        if (
          inputSubstring.charAt(childNumber - 1) === letterSpan.innerText &&
          prevColor === "greenColor"
        ) {
          letterSpan.classList.remove("redColor");
          letterSpan.classList.add("greenColor");
        } else {
          letterSpan.classList.remove("greenColor");
          letterSpan.classList.add("redColor");
        }
      } else {
        letterSpan.classList.remove("redColor", "greenColor");
      }

      childNumber--;
    }
  }

  function compareSpace(currentWord) {
    if (input.value.includes(" ")) {
      const [enteredWord, ...inputArray] = input.value.split(" ");
      if (enteredWord === currentWord.innerText.trim()) {
        wordNum++;
        input.value = inputArray.join(" ");
        currentWord.classList.remove("underLine");

        const nextWord = document.getElementById("w" + wordNum);
        if (nextWord) {
          nextWord.classList.add("underLine");
        }
        wordTyped++;
      }
    }
  }

  function compareDot(currentWord) {
    if (input.value.includes(".")) {
      const enteredWord = input.value;
      if (enteredWord === currentWord.innerText) {
        wordNum++;
        input.value = "";
        currentWord.classList.remove("underLine");

        const nextWord = document.getElementById("w" + wordNum);
        if (nextWord) {
          nextWord.classList.add("underLine");
        } else {
          setTimeout(stopInterval, 1000);
        }
        wordTyped++;
      }
    }
  }
  var time = 0;
  var wordsPerMinute = 0;
  var wordTyped = 0;
  const timer = document.getElementById("timer");
  const wpm = document.getElementById("wpm");
  var intervalStarted = false;
  function startInterval() {
    input.placeholder = "Type Here...";
    if (!intervalStarted) {
      intervalStarted = true;
      intervalId = setInterval(display, 1000);
    }
  }
  function display() {
    time++;
    wordsPerMinute = Math.ceil(wordTyped / (time / 60));
    timer.innerHTML = "Time: " + time;
    wpm.innerHTML = "WPM: " + wordsPerMinute;
  }
  function stopInterval() {
    clearInterval(intervalId);
  }
}
