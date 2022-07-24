
const output = document.querySelector('.output');

let firstInput = 0;
let secondInput;

document.querySelector('.clear').addEventListener('click', (e) => {
  output.textContent = '0';
  firstInput = 0;
});

document.querySelectorAll('.numbers button').forEach((button) => {
  if (Number.isNaN(+button.textContent)) return;
  
  button.addEventListener('click', (e) => {
    if (output.textContent === '0') {
      output.textContent = button.textContent;
      return;
    }

    output.textContent += button.textContent;
    secondInput = +output.textContent;
  });
});

document.querySelectorAll('.operators button').forEach((button) => {
  button.addEventListener('click', (e) => {
    console.log(button.textContent);
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