
const display = document.querySelector('.display');

let firstInput;
let secondInput;
let enteredSecondInput = false;
let operator = null;

document.querySelector('.clear').addEventListener('click', (e) => {
  display.textContent = '0';
  firstInput = 0;
  operator = null;
});

document.querySelectorAll('.numbers button').forEach((button) => {
  if (Number.isNaN(+button.textContent)) return;
  
  button.addEventListener('click', (e) => {
    if (!enteredSecondInput && operator !== null) {
      display.textContent = button.textContent;
      secondInput = +display.textContent;
      enteredSecondInput = true;
      return;
    }

    (display.textContent === '0')? display.textContent = button.textContent : display.textContent += button.textContent;
    (enteredSecondInput)? secondInput = +display.textContent : firstInput = +display.textContent;
  });
});

document.querySelectorAll('.operators button').forEach((button) => {
  button.addEventListener('click', (e) => {
    if (operator !== null && (enteredSecondInput || button.textContent === '=')) {
      firstInput = operate(operator, firstInput, secondInput);
      display.textContent = firstInput;
      enteredSecondInput = false;
    }

    if (button.textContent === '=') return;

    operator = button.textContent;
    secondInput = firstInput;
  });
});

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