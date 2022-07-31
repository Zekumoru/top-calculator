
import { ScrollableDisplay } from "./scripts/ScrollableDisplay.js";

const displays = {
  main: document.querySelector('.display.main input'),
  scroll: new ScrollableDisplay(document.querySelector('.scrollable-display')),
  result: document.querySelector('.display.main .operator'),
  currentOperand: {
    element: document.querySelector('div.current-operand'),
    left: document.querySelector('.current-operand div.left'),
    right: document.querySelector('.current-operand div.right')
  }
};
displays.operator = displays.result;

const classicPlaceHolderText = displays.main.placeholder;
const advancePlaceHolderText = 'Parenthesis (), factorial !, and exponents ^ are supported here!';

const classicCalculator = new ClassicCalculator(displays);
const advanceCalculator = new AdvanceCalculator(displays);

let calculatorInUse = classicCalculator;
const classicButton = document.querySelector('button.classic');
const advanceButton = document.querySelector('button.advance');
const classicPercentButton = document.querySelector('button.percent');
const negateButton = document.querySelector('button.negate');
const advanceOperators = document.querySelector('div.advance-operators');

const swapCalculator = function({calculator, readOnly, placeholder, display, showAdvanceOperators, fromButton, toButton}) {
  calculatorInUse.clear();
  calculatorInUse = calculator;
  displays.main.readOnly = readOnly;
  displays.main.placeholder = placeholder;
  displays.currentOperand.element.style.display = display;
  
  if (showAdvanceOperators) {
    classicPercentButton.style.display = 'none';
    negateButton.style.display = 'none';
    advanceOperators.style.display = 'flex';
  }
  else {
    classicPercentButton.style.display = 'block';
    negateButton.style.display = 'block';
    advanceOperators.style.display = 'none';
  }

  toButton.classList.remove('selected');
  fromButton.classList.add('selected');
  displays.main.focus();
};

classicButton.addEventListener('click', (e) => {
  if (calculatorInUse === classicCalculator) return;
  swapCalculator({
    calculator: classicCalculator,
    readOnly: true,
    placeholder: classicPlaceHolderText,
    display: 'flex',
    showAdvanceOperators: false,
    fromButton: classicButton,
    toButton: advanceButton
  });
});

advanceButton.addEventListener('click', (e) => {
  if (calculatorInUse === advanceCalculator) return;
  swapCalculator({
    calculator: advanceCalculator,
    readOnly: false,
    placeholder: advancePlaceHolderText,
    display: 'none',
    showAdvanceOperators: true,
    fromButton: advanceButton,
    toButton: classicButton
  });
});

const preventDefaultAndInvoke = function(e, fn) {
  e.preventDefault();
  fn();
};

document.querySelectorAll('button.digit').forEach((digit) => {
  digit.addEventListener('mousedown', (e) => {
    preventDefaultAndInvoke(e, () => calculatorInUse.digit(digit.textContent));
  });
});

document.querySelectorAll('button.arithmetic').forEach((arithmetic) => {
  arithmetic.addEventListener('mousedown', (e) => {
    preventDefaultAndInvoke(e, () => calculatorInUse.operator(arithmetic.textContent));
  });
});

document.querySelector('button.enter').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.enter()));
document.querySelector('button.dot').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.dot()));
document.querySelector('button.backspace').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.backspace()));
document.querySelector('button.clear').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.clear()));
classicPercentButton.addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.percent()));
negateButton.addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.negate()));

document.querySelector('button.left-paren').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.leftParen()));
document.querySelector('button.right-paren').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.rightParen()));
document.querySelector('.advance-operators button.percent').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.percent()));
document.querySelector('button.exponent').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.exponent()));
document.querySelector('button.factorial').addEventListener('mousedown', (e) => preventDefaultAndInvoke(e, () => calculatorInUse.factorial()));

window.addEventListener('keydown', (e) => {
  calculatorInUse.handleKeyDown(e.key);
});

// Automatically switch to advance calculator for testing purposes
advanceButton.click();

function AdvanceCalculator({main, scroll, result, clear}) {
  const display = main;
  const scrollableDisplay = scroll;
  const resultDisplay = result;

  this.handleKeyDown = function(key) { display.focus(); };
  
  this.clear = function() {
    this.updateDisplay('');
    resultDisplay.textContent = '';
    scrollableDisplay.clear();
  };

  this.digit = (digit) => this.appendToDisplay(digit);
  this.operator = (op) => this.appendToDisplay(op);
  this.dot = () => this.appendToDisplay('.');
  this.percent = () => this.appendToDisplay('%');
  this.leftParen = () => this.appendToDisplay('(');
  this.rightParen = () => this.appendToDisplay(')');
  this.exponent = () => this.appendToDisplay('^');
  this.factorial = () => this.appendToDisplay('!');

  this.enter = function() {};
  this.backspace = function() {
    this.updateDisplay(display.value.slice(0, -1));
  };

  this.updateDisplay = function(string) {
    display.value = string;
  };
  
  this.appendToDisplay = function(string) {
    this.updateDisplay(display.value + string);
  };
}

function ClassicCalculator(displays) {
  const display = displays.main;
  const operatorDisplay = displays.operator;
  const scrollableDisplay = displays.scroll;
  const currentOperandDisplay = displays.currentOperand;
  const leftOperand = new Operand('left', 0);
  const rightOperand = new Operand('right', 0);
  let operator = null;
  let startRightOperand = false;
  let evaluated = false;
  let active = leftOperand;

  this.handleKeyDown = function(key) {
    if (!isNaN(key)) {
      calculatorInUse.digit(key);
      display.focus();
      return;
    }
  
    if ('+-/*'.includes(key)) {
      calculatorInUse.operator(key);
      display.focus();
      return;
    }
  
    switch (key) {
      case 'Enter':
      case '=':
        calculatorInUse.evaluate();
        display.focus();
        break;
      case '.':
        calculatorInUse.dot();
        display.focus();
        break;
      case 'Backspace':
        calculatorInUse.backspace();
        display.focus();
        break;
      case 'Delete':
      case 'Escape':
        calculatorInUse.clear();
        display.focus();
        break;
      case '%':
        calculatorInUse.percent();
        display.focus();
        break;
    }
  };

  this.clear = function() {
    leftOperand.value = 0;
    rightOperand.value = 0;
    operator = null;
    startRightOperand = false;
    evaluated = false;
    this.setActive(leftOperand);
    this.updateDisplay('');
    this.updateOperatorDisplay('');
    scrollableDisplay.clear();
  };

  this.digit = function(digit) {
    let reset = false;
    this.resolveActive(() => {
      startRightOperand = true
      reset = true;
    });

    if (display.value === '0' || (operator && startRightOperand) || evaluated || reset) {
      this.updateDisplay(digit);
      evaluated = false;
      startRightOperand = false;
    }
    else {
      this.appendToDisplay(digit);
    }

    active.value = +display.value;
  };

  this.operator = function(op) {
    if (!evaluated && !startRightOperand) this.evaluate();

    operator = op;
    this.updateOperatorDisplay(op);

    if (active === leftOperand || evaluated) {
      rightOperand.value = leftOperand.value;
      this.setActive(rightOperand);
      evaluated = false;
      startRightOperand = true;
    }
  };

  this.enter = function() {
    this.evaluate();
  };

  this.evaluate = function() {
    if (display.value.slice(-1) === '.') this.updateDisplay(+display.value);
    if (active === leftOperand) return;
    
    const result = operate(operator, leftOperand.value, rightOperand.value);
    const previousLeftOperand = { ...leftOperand };
    leftOperand.value = result;
    this.updateDisplay(result);
    this.updateOperatorDisplay('=');
    evaluated = true;
    scrollableDisplay.addEntry(`${+previousLeftOperand.value.toFixed(10)} ${operator} ${+rightOperand.value.toFixed(10)}`, '');
  };

  this.dot = function() {
    if (display.value.includes('.')) return;
    if (!evaluated && startRightOperand) {
      this.updateDisplay('0.');
      active.value = 0;
      startRightOperand = false;
      return;
    }

    this.resolveActive();
    this.appendToDisplay('.');
  };

  this.backspace = function() {
    if (display.value === '0') return;

    let backspaced = display.value.slice(0, -1);
    if (backspaced === '') backspaced = '0';

    this.resolveActive();
    this.updateDisplay(backspaced);
    active.value = +backspaced;
  };

  this.percent = function() {
    this.resolveActive();
    active.value /= 100;
    this.updateDisplay(active.value);
  };

  this.negate = function() {
    this.resolveActive();
    active.value = -active.value;
    this.updateDisplay(active.value);
  };

  this.setActive = function(operand) {
    active = operand;
    currentOperandDisplay.left.classList.remove('active');
    currentOperandDisplay.right.classList.remove('active');
    currentOperandDisplay[active.name].classList.add('active');
  }

  this.resolveActive = function(fn) {
    if (evaluated) {
      this.setActive(leftOperand);
      startRightOperand = false;
      evaluated = false;
      operator = null;
      this.updateOperatorDisplay('');
      scrollableDisplay.addEntry(display.value, '=');
      if (typeof fn === 'function') fn();
    }
  };

  this.updateOperatorDisplay = function(string) {
    operatorDisplay.textContent = string;
  };

  this.updateDisplay = function(string) {
    display.value = (typeof string === 'number')? +string.toFixed(10) : string;
  };

  this.appendToDisplay = function(string) {
    this.updateDisplay(display.value + string);
  };

  this.expose = function() {
    return {
      leftOperand,
      rightOperand,
      active,
      startRightOperand,
      evaluated,
      operator,
      display: display.value
    };
  };

  function Operand(name, value) {
    this.name = name;
    this.value = value;
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
