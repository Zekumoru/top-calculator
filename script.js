
const calculator = new Calculator();

document.querySelectorAll('button.digit').forEach((digit) => {
  digit.addEventListener('click', (e) => {
    calculator.appendDigit(digit.textContent);
  });
});

document.querySelectorAll('button.arithmetic').forEach((arithmetic) => {
  arithmetic.addEventListener('click', (e) => {
    calculator.setOperator(arithmetic.textContent);
  });
});

document.querySelector('button.equal').addEventListener('click', calculator.evaluate);

function Input(value) {
  this.value = value;
}

function Calculator() {
  const display = document.querySelector('.display');
  const firstInput = new Input(0);
  const secondInput = new Input(0);
  let operator = null;
  let enter = false;
  let active = firstInput;

  this.appendDigit = function(digit) {
    if (display.textContent === '0' || (operator && enter)) {
      this.updateDisplay(digit);
      enter = false;
    }
    else {
      this.updateDisplay(display.textContent + digit);
    }
    active.value = +display.textContent;
  }

  this.setOperator = function(op) {
    operator = op;

    if (active === firstInput) {
      secondInput.value = firstInput.value;
      active = secondInput;
      enter = true;
    }
  }

  this.evaluate = function() {
    
  }

  this.updateDisplay = function(string) {
    display.textContent = string;
  }

  this.expose = function() {
    return {
      firstInput,
      secondInput,
      active,
      operator
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