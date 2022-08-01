
export function AdvanceCalculator({main, scroll, result, clear}) {
  const display = main;
  const scrollableDisplay = scroll;
  const resultDisplay = result;

  this.handleKeyDown = function(key) { display.focus(); };
  
  this.evaluate = function() {
    const lexer = new Lexer(main.value);
    const evaluator = new Evaluator(lexer.lexemes);
    const result = evaluator.factor();
    console.log(lexer.lexemes);
    console.log(result);
    resultDisplay.textContent = result;
  };

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

  this.enter = function() {
    this.evaluate();
  };

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

export const LexemeType = {
  plus: '+',
  minus: '-',
};

export function Lexer(source) {
  this.source = source;
  this.lexemes = source.replace(RegexPatterns.spaces, '').match(RegexPatterns.calculatorLexemes);
}

export function Evaluator(lexemes) {
  this.lexemes = lexemes ?? [];

  this.advance = function() {
    return this.lexemes.shift();
  };

  this.peek = function() {
    return this.lexemes[0];
  };

  this.factor = function() {
    const a = this.advance();
    if (a === undefined) return NaN;
    if (a === LexemeType.plus) return this.factor();
    if (a === LexemeType.minus) return -this.factor();
    return +a;
  };
}