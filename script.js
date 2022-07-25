
const calculator = new Calculator();
const data = calculator.expose();

document.querySelectorAll('button.digit').forEach((digit) => {
  digit.addEventListener('click', (e) => {
    calculator.appendDigit(digit.textContent);
  });
});

function Input(value) {
  this.value = value;
}

function Calculator() {
  const display = document.querySelector('.display');
  const firstInput = new Input(0);
  const secondInput = new Input(0);
  let active = firstInput;

  this.appendDigit = function(digit) {
    if (display.textContent === '0') {
      this.updateDisplay(digit);
    }
    else {
      this.updateDisplay(display.textContent + digit);
    }
    active.value = +display.textContent;
  }

  this.updateDisplay = function(string) {
    display.textContent = string;
  }

  this.expose = function() {
    return {
      firstInput,
      secondInput,
      active
    };
  }
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