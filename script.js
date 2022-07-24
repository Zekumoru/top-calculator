
const display = document.querySelector('.display');

let firstInput;
let secondInput;
let enteredSecondInput = false;
let enteredDot = false;
let operator = null;
let error = false;

document.querySelector('.clear').addEventListener('click', (e) => {
  updateDisplay(0);
  firstInput = 0;
  secondInput = 0;
  enteredSecondInput = false;
  operator = null;
  error = false;
});

document.querySelector('.dot').addEventListener('click', (e) => {
  if (enteredDot) return;

  updateDisplay(display.textContent + '.');
  enteredDot = true;
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