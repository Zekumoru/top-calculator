
const calculator = new Calculator(document.querySelector('.display'));

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

document.querySelector('button.equal').addEventListener('click', (e) => calculator.evaluate());
document.querySelector('button.dot').addEventListener('click', (e) => calculator.appendDot());
document.querySelector('button.backspace').addEventListener('click', (e) => calculator.backspace());
document.querySelector('button.clear').addEventListener('click', (e) => calculator.clear());

function Input(value) {
  this.value = value;
}

function Calculator(_display) {
  const display = _display;
  const firstInput = new Input(0);
  const secondInput = new Input(0);
  let operator = null;
  let enter = false;
  let evaluated = false;
  let active = firstInput;

  this.clear = function() {
    firstInput.value = 0;
    secondInput.value = 0;
    operator = null;
    enter = false;
    evaluated = false;
    active = firstInput;
    this.updateDisplay('0');
  }

  this.appendDigit = function(digit) {
    if (evaluated) {
      active = firstInput;
      enter = true;
    }

    if (display.textContent === '0' || (operator && enter) || evaluated) {
      this.updateDisplay(digit);
      evaluated = false;
      enter = false;
    }
    else {
      this.appendToDisplay(digit);
    }

    active.value = +display.textContent;
  }

  this.setOperator = function(op) {
    operator = op;

    if (active === firstInput || evaluated) {
      secondInput.value = firstInput.value;
      active = secondInput;
      evaluated = false;
      enter = true;
    }
  }

  this.evaluate = function() {
    if (display.textContent.slice(-1) === '.') this.updateDisplay(+display.textContent);
    if (active === firstInput) return;
    
    const result = operate(operator, firstInput.value, secondInput.value);
    firstInput.value = result;
    this.updateDisplay(result);
    evaluated = true;
  }

  this.appendDot = function() {
    if (display.textContent.includes('.')) return;

    this.appendToDisplay('.');
    resolveActive();
  }

  this.backspace = function() {
    if (display.textContent === '0') return;

    let backspaced = display.textContent.slice(0, -1);
    if (backspaced === '') backspaced = '0';

    resolveActive();
    this.updateDisplay(backspaced);
    active.value = +backspaced;
  }

  this.updateDisplay = function(string) {
    display.textContent = (typeof string === 'number')? +string.toFixed(10) : string;
  }

  this.appendToDisplay = function(string) {
    this.updateDisplay(display.textContent + string);
  }

  this.expose = function() {
    return {
      firstInput,
      secondInput,
      active,
      enter,
      evaluated,
      operator,
      display: display.textContent
    };
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

  function resolveActive() {
    if (evaluated) {
      active = firstInput;
      evaluated = false;
    }
  }
}