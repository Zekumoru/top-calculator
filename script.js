
const display = document.querySelector('.display');

let firstInput;
let secondInput;
let enteredSecondInput = false;
let operator = null;

document.querySelector('.clear').addEventListener('click', (e) => {
  updateDisplay(0);
  firstInput = 0;
  secondInput = 0;
  enteredSecondInput = false;
  operator = null;
});

document.querySelectorAll('.numbers button').forEach((button) => {
  if (Number.isNaN(+button.textContent)) return;
  
  button.addEventListener('click', (e) => {
    if (!enteredSecondInput && operator !== null) {
      updateDisplay(button.textContent);
      secondInput = +button.textContent;
      enteredSecondInput = true;
      return;
    }

    (display.textContent === '0')? updateDisplay(button.textContent) : updateDisplay(display.textContent + button.textContent);
    (enteredSecondInput)? secondInput = +display.textContent : firstInput = +display.textContent;
  });
});

document.querySelectorAll('.operators button').forEach((button) => {
  button.addEventListener('click', (e) => {
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