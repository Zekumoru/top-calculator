
const display = document.querySelector('.display');

let firstInput;
let secondInput;
let operator = null;
let enteredSecondInput = false;
let enteredDot = false;
let error = false;

document.querySelector('.clear').addEventListener('click', (e) => {
  updateDisplay(0);
  reset();
});

document.querySelector('.dot').addEventListener('click', (e) => {
  if (!enteredSecondInput && operator !== null) {
    updateDisplay('0.');
    secondInput = 0;
    enteredSecondInput = true;
    return;
  }

  if (enteredDot) return;

  updateDisplay(display.textContent + '.');
  enteredDot = true;
});

document.querySelector('.backspace').addEventListener('click', (e) => {
  if (display.textContent === '0') return;
  if (display.textContent.length === 1) {
    updateDisplay('0');
    return;
  }

  if (display.textContent.slice(-1) === '.') enteredDot = false;
  updateDisplay(display.textContent.slice(0, -1));
});

document.querySelectorAll('.numbers button.digit').forEach((button) => {
  button.addEventListener('click', (e) => {
    if (error) return;

    if (!enteredSecondInput && operator !== null) {
      updateDisplay(button.textContent);
      secondInput = +button.textContent;
      enteredSecondInput = true;
      enteredDot = false;
      return;
    }

    (display.textContent === '0')? updateDisplay(button.textContent) : updateDisplay(display.textContent + button.textContent);
    (enteredSecondInput)? secondInput = +display.textContent : firstInput = +display.textContent;
  });
});

document.querySelectorAll('.operators button.operator').forEach((button) => {
  button.addEventListener('click', (e) => {
    if (error) return;

    if (operator === '/' && secondInput === 0) {
      updateDisplay('ERR: Division by Zero');
      error = -1;
      return;
    }

    if (operator !== null && (enteredSecondInput || button.textContent === '=')) {
      firstInput = operate(operator, firstInput, secondInput);
      updateDisplay(firstInput);
      enteredSecondInput = false;
    }

    if (button.textContent === '=') return;

    operator = button.textContent;
    secondInput = firstInput;
  });
});

function updateDisplay(string) {
  display.textContent = (typeof string === 'number')? +string.toFixed(10) : string;
}

function reset() {
  firstInput = 0;
  secondInput = 0;
  operator = null;
  enteredSecondInput = false;
  enteredDot = false;
  error = false;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(op, a, b) {
  switch(op) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}