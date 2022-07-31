
export function AdvanceCalculator({main, scroll, result, clear}) {
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

export const RegexPatterns = {
  spaces: /\s*/g,
  calculatorLexemes: /\d+\.?\d*|[+\-*\/]|./gi,
};

export function Lexer(source) {
  this.source = source;
  this.tokens = source.replace(RegexPatterns.spaces, '').match(RegexPatterns.calculatorLexemes);
}