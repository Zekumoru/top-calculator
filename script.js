
const display = document.querySelector('.display.main input');
const calculator = new Calculator(display, document.querySelector('.display.main .result'));

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

document.querySelector('button.enter').addEventListener('click', (e) => calculator.evaluate());
document.querySelector('button.dot').addEventListener('click', (e) => calculator.appendDot());
document.querySelector('button.backspace').addEventListener('click', (e) => calculator.backspace());
document.querySelector('button.clear').addEventListener('click', (e) => calculator.clear());

window.addEventListener('keydown', (e) => {
  if (!isNaN(e.key)) {
    calculator.appendDigit(e.key);
    display.focus();
    return;
  }

  if ('+-/*'.includes(e.key)) {
    calculator.setOperator(e.key);
    display.focus();
    return;
  }

  switch (e.key) {
    case 'Enter':
    case '=':
      calculator.evaluate();
      display.focus();
      break;
    case '.':
      calculator.appendDot();
      display.focus();
      break;
    case 'Backspace':
      calculator.backspace();
      display.focus();
      break;
    case 'Delete':
    case 'Escape':
      calculator.clear();
      display.focus();
      break;
  }
});

function Input(name, value) {
  this.name = name;
  this.value = value;
}

function Calculator(_display, _operatorDisplay) {
  const display = _display;
  const operatorDisplay = _operatorDisplay;
  const firstInput = new Input('first', 0);
  const secondInput = new Input('second', 0);
  let operator = null;
  let startSecondInput = false;
  let evaluated = false;
  let active = firstInput;

  this.clear = function() {
    firstInput.value = 0;
    secondInput.value = 0;
    operator = null;
    startSecondInput = false;
    evaluated = false;
    active = firstInput;
    this.updateDisplay('0');
    this.updateOperatorDisplay('');
  }

  this.appendDigit = function(digit) {
    this.resolveActive(() => startSecondInput = true);

    if (display.value === '0' || (operator && startSecondInput) || evaluated) {
      this.updateDisplay(digit);
      evaluated = false;
      startSecondInput = false;
    }
    else {
      this.appendToDisplay(digit);
    }

    active.value = +display.value;
  }

  this.setOperator = function(op) {
    if (!evaluated && !startSecondInput) this.evaluate();

    operator = op;
    this.updateOperatorDisplay(op);

    if (active === firstInput || evaluated) {
      secondInput.value = firstInput.value;
      active = secondInput;
      evaluated = false;
      startSecondInput = true;
    }
  }

  this.evaluate = function() {
    if (display.value.slice(-1) === '.') this.updateDisplay(+display.value);
    if (active === firstInput) return;
    
    const result = operate(operator, firstInput.value, secondInput.value);
    firstInput.value = result;
    this.updateDisplay(result);
    this.updateOperatorDisplay('=');
    evaluated = true;
  }

  this.appendDot = function() {
    if (display.value.includes('.')) return;
    if (!evaluated && startSecondInput) {
      this.updateDisplay('0.');
      active.value = 0;
      startSecondInput = false;
      return;
    }

    this.appendToDisplay('.');
    this.resolveActive();
  }

  this.backspace = function() {
    if (display.value === '0') return;

    let backspaced = display.value.slice(0, -1);
    if (backspaced === '') backspaced = '0';

    this.resolveActive();
    this.updateDisplay(backspaced);
    active.value = +backspaced;
  }

  this.resolveActive = function(fn) {
    if (evaluated) {
      active = firstInput;
      evaluated = false;
      this.updateOperatorDisplay('');
      if (fn === 'function') fn();
    }
  }

  this.updateOperatorDisplay = function(string) {
    operatorDisplay.textContent = string;
  }

  this.updateDisplay = function(string) {
    display.value = (typeof string === 'number')? +string.toFixed(10) : string;
  }

  this.appendToDisplay = function(string) {
    this.updateDisplay(display.value + string);
  }

  this.expose = function() {
    return {
      firstInput,
      secondInput,
      active,
      startSecondInput,
      evaluated,
      operator,
      display: display.value
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
}