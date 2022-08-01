
export function AdvanceCalculator({main, scroll, result, clear}) {
  const display = main;
  const scrollableDisplay = scroll;
  const resultDisplay = result;

  this.handleKeyDown = function(key) { display.focus(); };
  
  this.evaluate = function() {
    if (display.value === '') return; 

    const lexer = new Lexer(main.value);
    const evaluator = new Evaluator(lexer.lexemes);
    const result = evaluator.evaluate();
    console.log(lexer.lexemes);
    console.log(result);
    resultDisplay.textContent = +result.toFixed(10);
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
  asterisk: '*',
  slash: '/',
  caret: '^',
  exclamation: '!',
  percent: '%',
  leftParen: '(',
  rightParen: ')',
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

  this.evaluate = function() {
    const result = this.expression();
    if (this.lexemes.length > 0) return NaN;
    return result;
  };

  this.parenthesis = function() {
    if (this.peek() !== LexemeType.leftParen) return NaN;
    this.advance();
    let a = this.expression();
    if (this.advance() !== LexemeType.rightParen) return NaN;

    const peeked = this.peek();
    if (peeked === LexemeType.percent) {
      this.advance();
      a = a / 100;
    }
    else if (peeked === LexemeType.exclamation) {
      this.advance();
      a = this.gamma(a);
    }
    else if (peeked === LexemeType.caret) {
      this.advance();
      const b = this.factor();
      a = a ** b;
    }
    else {
      const temp = [...this.lexemes];
      const b = this.factor();
      if (!isNaN(b)) {
        a = a * b;
      }
      else {
        this.lexemes = temp;
      }
    }

    return a;
  }

  this.factor = function() {
    const peeked = this.peek();
    if (peeked === undefined) return NaN;
    if (!isNaN(peeked)) return +this.advance();
    if (peeked === LexemeType.plus) {
      this.advance();
      return this.factor();
    }
    if (peeked === LexemeType.minus) {
      this.advance();
      return -this.factor();
    }
    return this.parenthesis();
  };

  this.percent = function() {
    let a = this.factor();
    while (a !== NaN) {
      const peeked = this.peek();
      if (peeked === LexemeType.percent) {
        this.advance();
        a = a / 100;
      }
      else {
        return +a;
      }
    }
    return NaN;
  };

  this.factorial = function() {
    let a = this.percent();
    while (a !== NaN) {
      const peeked = this.peek();
      if (peeked === LexemeType.exclamation) {
        this.advance();
        a = this.gamma(a);
      }
      else {
        return +a;
      }
    }
    return NaN;
  };

  this.gamma = function(z) {
    let g = 7;
    let C = [
      0.99999999999980993, 
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313, 
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
      x += C[i] / (z + i);
    }
    
    let t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
  };

  this.exponent = function() {
    let a = this.factorial();
    while (a !== NaN) {
      const peeked = this.peek();
      if (peeked === LexemeType.caret) {
        this.advance();
        const b = this.factorial();
        a = a ** b;
      }
      else {
        return +a;
      }
    }
    return NaN;
  };

  this.term = function() {
    let a = this.exponent();
    while (a !== NaN) {
      const peeked = this.peek();
      if (peeked === LexemeType.asterisk) {
        this.advance();
        const b = this.exponent();
        a = a * b;
      }
      else if (peeked === LexemeType.slash) {
        this.advance();
        const b = this.exponent();
        a = a / b;
      }
      else if (!isNaN(peeked)) {
        const b = this.exponent();
        a = a * b;
      }
      else {
        const temp = [...this.lexemes];
        const b = this.parenthesis();
        if (isNaN(b)) {
          this.lexemes = temp;
          return +a;
        }

        a = a * b;
      }
    }
    return NaN;
  };

  this.expression = function() {
    let a = this.term();
    while (a !== NaN) {
      const peeked = this.peek();
      if (peeked === LexemeType.plus) {
        this.advance();
        const b = this.term();
        a = a + b;
      }
      else if (peeked === LexemeType.minus) {
        this.advance();
        const b = this.term();
        a = a - b;
      }
      else {
        return +a;
      }
    }
    return NaN;
  };
}