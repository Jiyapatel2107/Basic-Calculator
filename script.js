// Get reference to the display input field
let display = document.getElementById("display");
// Memory value for M+, M-, MR, MC functions
let memory = 0;

function updateDisplayContent(newContent, moveCursorToEnd = false) {
  const oldPos = display.selectionStart;
  display.value = newContent;
  if (moveCursorToEnd) {
    setCursorPosition(newContent.length); // move to end
  } else {
    setCursorPosition(oldPos); // keep user cursor
  }
}

//Inserts a number at the current cursor position.
function appendNumber(num) {
  insertAtCursor(num);
}

/**
 Inserts an operator (e.g. +, -, *, /, %) at the current cursor position.
 Prevents adding an operator if the last character is already an operator.
*/
function appendOperator(op) {
  const cursorPos = display.selectionStart;
  const val = display.value;
  if (/[+\-*/%]$/.test(val.trim())) return; // Prevent duplicate operators
  const newVal = val.slice(0, cursorPos) + ` ${op} ` + val.slice(cursorPos);
  updateDisplayContent(newVal);
  setCursorPosition(cursorPos + op.length + 2);
}

//Inserts a decimal dot at the cursor position.
function appendDot() {
  insertAtCursor(".");
}

//Clears the entire display.
function clearDisplay() {
  updateDisplayContent("");
}

//Deletes the character before the current cursor position.
function backspace() {
  const pos = display.selectionStart;
  if (pos > 0) {
    const val = display.value;
    const newVal = val.slice(0, pos - 1) + val.slice(pos);
    updateDisplayContent(newVal);
    setCursorPosition(pos - 1);
  }
}

//Toggles the sign of the current number.
function toggleSign() {
  try {
    const val = parseFloat(display.value);
    if (!isNaN(val)) {
      updateDisplayContent((-val).toString(), true);
    }
  } catch {
    updateDisplayContent("Error", true);
  }
}

/**
 * Evaluates the expression in the display and shows the result.
 * Also handles '%' as division by 100.
*/
function calculate() {
  try {
    const result = Function(`return (${display.value.replace(/%/g, "/100")})`)();
    updateDisplayContent(result.toString(), true);
  } catch {
    updateDisplayContent("Error", true);
  }
}

//Calculates and displays the square root of the current expression.
function calculateSqrt() {
  try {
    const result = Math.sqrt(eval(display.value));
    updateDisplayContent(result.toString(), true);
  } catch {
    updateDisplayContent("Error", true);
  }
}

//Calculates and displays the square of the current expression.
function calculateSquare() {
  try {
    const result = Math.pow(eval(display.value), 2);
    updateDisplayContent(result.toString(), true);
  } catch {
    updateDisplayContent("Error!!", true);
  }
}

//Calculates and displays the cube of the current expression.
function calculateCube() {
  try {
    const result = Math.pow(eval(display.value), 3);
    updateDisplayContent(result.toString(), true);
  } catch {
    updateDisplayContent("Error!!", true);
  }
}

//Calculates and displays the reciprocal (1/x) of the current expression.
function calculateReciprocal() {
  try {
    const result = 1 / eval(display.value);
    updateDisplayContent(result.toString(), true);
  } catch {
    updateDisplayContent("Error!!", true);
  }
}

//Adds the current value to memory.
function memoryAdd() {
  try {
    memory += parseFloat(eval(display.value));
  } catch {
    memory = 0;
  }
}

//Subtracts the current value from memory.
function memorySubtract() {
  try {
    memory -= parseFloat(eval(display.value));
  } catch {
    memory = 0;
  }
}

//Recalls the memory value to the display.
function memoryRecall() {
  updateDisplayContent(memory.toString(), true);
}

//Clears the memory value.
function memoryClear() {
  memory = 0;
}

//Inserts text at the current cursor position.
function insertAtCursor(text) {
  const start = display.selectionStart;
  const end = display.selectionEnd;
  const val = display.value;
  const newVal = val.substring(0, start) + text + val.substring(end);
  updateDisplayContent(newVal);
  setCursorPosition(start + text.length);
}

//Sets the cursor to a specific position in the display.
function setCursorPosition(pos) {
  display.focus();
  display.setSelectionRange(pos, pos);
}

// Inserts bracket at cursor position
function appendBracket(bracket) {
  insertAtCursor(bracket);
}

//Toggles dark mode by switching a CSS class.
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

//Plays a click sound for button interactions.
function playClickSound() {
  const audio = new Audio("button-202966.mp3");
  audio.play();
}

// Add sound to all button interactions
[
  "appendNumber", "appendOperator", "appendDot", "clearDisplay", "backspace",
  "toggleSign", "calculate", "calculateSqrt", "calculateSquare", "calculateCube",
  "calculateReciprocal", "memoryAdd", "memorySubtract", "memoryRecall", "memoryClear","appendBracket"
].forEach(fn => {
  const original = window[fn];
  window[fn] = function (...args) {
    playClickSound();
    return original(...args);
  };
});
