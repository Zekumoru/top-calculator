import { ScrollableDisplay } from "./scripts/ScrollableDisplay.js";
import { ClassicCalculator } from "./scripts/ClassicCalculator.js";
import { AdvanceCalculator } from "./scripts/AdvanceCalculator.js";

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
  displays.main.focus();
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

const validKeys = [ 'Backspace', 'Delete', 'Escape' ];
window.addEventListener('keyup', (e) => {
  if (calculatorInUse === advanceCalculator) {
    if (e.key === 'Enter') {
      calculatorInUse.enter();
      return;
    }

    if (!(/[0-9\.\+\-\*\\\(\)\^\!\%]/.test(e.key) || validKeys.includes(e.key))) return;
    calculatorInUse.evaluate();
  }
});
