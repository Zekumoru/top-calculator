
const display = document.querySelector('.display.main input');
const currentOperandDisplay = {
  left: document.querySelector('.current-operand div.left'),
  right: document.querySelector('.current-operand div.right')
};

const scrollableDisplay = new ScrollableDisplay(document.querySelector('.scrollable-display'));
const calculator = new ClassicCalculator({
  _display: display,
  _operatorDisplay: document.querySelector('.display.main .operator'),
  _scrollableDisplay: scrollableDisplay,
  _currentOperandDisplay: currentOperandDisplay
});

document.querySelectorAll('button.digit').forEach((digit) => {
  digit.addEventListener('click', (e) => {
    calculator.handleKeyDown(digit.textContent);
  });
});

document.querySelectorAll('button.arithmetic').forEach((arithmetic) => {
  arithmetic.addEventListener('click', (e) => {
    calculator.handleKeyDown(arithmetic.textContent);
  });
});

document.querySelector('button.enter').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));
document.querySelector('button.dot').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));
document.querySelector('button.backspace').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));
document.querySelector('button.clear').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));
document.querySelector('button.percent').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));
document.querySelector('button.negate').addEventListener('click', (e) => calculator.handleKeyDown(e.target.textContent));

window.addEventListener('keydown', (e) => {
  calculator.handleKeyDown(e.key);
});

function ClassicCalculator({_display, _operatorDisplay, _scrollableDisplay, _currentOperandDisplay}) {
  const display = _display;
  const operatorDisplay = _operatorDisplay;
  const scrollableDisplay = _scrollableDisplay;
  const currentOperandDisplay = _currentOperandDisplay;
  const leftOperand = new Operand('left', 0);
  const rightOperand = new Operand('right', 0);
  let operator = null;
  let startRightOperand = false;
  let evaluated = false;
  let active = leftOperand;

  this.onChangeActive = function (active) {
    currentOperandDisplay.left.classList.toggle('active');
    currentOperandDisplay.right.classList.toggle('active');
  };

  this.onEvaluated = function(operator, leftOperand, rightOperand) {
    scrollableDisplay.addEntry(`${+leftOperand.toFixed(10)} ${operator} ${+rightOperand.toFixed(10)}`, '');
  };

  this.onNewInput = function(display, operator) {
    scrollableDisplay.addEntry(display, '=');
  };

  this.onClear = function() {
    scrollableDisplay.clear();
  };

  this.handleKeyDown = function(key) {
    if (!isNaN(key)) {
      calculator.appendDigit(key);
      display.focus();
      return;
    }
  
    if ('+-/*'.includes(key)) {
      calculator.setOperator(key);
      display.focus();
      return;
    }
  
    switch (key) {
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
      case '%':
        calculator.percent();
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
    this.updateDisplay('0');
    this.updateOperatorDisplay('');
    if (typeof this.onClear === 'function') this.onClear();
  };

  this.appendDigit = function(digit) {let reset = false;
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

  this.setOperator = function(op) {
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

  this.evaluate = function() {
    if (display.value.slice(-1) === '.') this.updateDisplay(+display.value);
    if (active === leftOperand) return;
    
    const result = operate(operator, leftOperand.value, rightOperand.value);
    const previousFirstValue = leftOperand.value;
    leftOperand.value = result;
    this.updateDisplay(result);
    this.updateOperatorDisplay('=');
    evaluated = true;
    if (typeof this.onEvaluated === 'function') this.onEvaluated(operator, previousFirstValue, rightOperand.value, result);
  };

  this.appendDot = function() {
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
    if (typeof this.onChangeActive === 'function') this.onChangeActive(active);
  }

  this.resolveActive = function(fn) {
    if (evaluated) {
      this.setActive(leftOperand);
      startRightOperand = false;
      evaluated = false;
      operator = null;
      this.updateOperatorDisplay('');
      if (typeof this.onNewInput === 'function') this.onNewInput(display.value, operatorDisplay.textContent);
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

function ScrollableDisplay(_scrollableDisplay) {
  const scrollableDisplay = _scrollableDisplay;
  let overflowed = false;

  this.addEntry = (input, result) => {
    this.appendToScrollableDisplay(this.createEntry(input, result));
  };

  this.clear = () => {
    scrollableDisplay.innerHTML = '';
  };

  this.createEntry = (input, result) => {
    const entry = document.createElement('div');
    entry.classList.add('display');
  
    const previousInput = document.createElement('input');
    previousInput.type = 'text';
    previousInput.value = input;
    previousInput.readOnly = true;
  
    const right = document.createElement('div');
    right.classList.add('result');
    right.textContent = result;
    
    entry.appendChild(previousInput);
    entry.appendChild(right);
  
    return entry;
  };

  this.appendToScrollableDisplay = (entry) => {
    scrollableDisplay.insertBefore(entry, scrollableDisplay.firstChild);
  
    if (!overflowed && isOverflowed(scrollableDisplay)) {
      scrollableDisplay.lastElementChild.style.borderTopColor = 'transparent';
      overflowed = true;
    }
  
    scrollableDisplay.scrollTop = scrollableDisplay.scrollHeight;
  };

  function isOverflowed({ clientWidth, clientHeight, scrollWidth, scrollHeight }) {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
  }
}
