
export function ClassicCalculator(displays) {
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
      this.digit(key);
      display.focus();
      return;
    }
  
    if ('+-/*'.includes(key)) {
      this.operator(key);
      display.focus();
      return;
    }
  
    switch (key) {
      case 'Enter':
      case '=':
        this.evaluate();
        display.focus();
        break;
      case '.':
        this.dot();
        display.focus();
        break;
      case 'Backspace':
        this.backspace();
        display.focus();
        break;
      case 'Delete':
      case 'Escape':
        this.clear();
        display.focus();
        break;
      case '%':
        this.percent();
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
