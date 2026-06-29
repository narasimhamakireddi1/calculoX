/**
 * Scientific Calculator Engine
 * Full expression parser: Tokenizer → Shunting-Yard → RPN Evaluator
 * Supports: standard math, trigonometry, complex numbers, matrices, statistics
 */

export type AngleUnit = 'DEG' | 'RAD';
export type EngineMode = 'STANDARD' | 'COMPLEX' | 'MATRIX' | 'STATISTICAL';

export interface CalcContext {
  angleUnit: AngleUnit;
  memory: number;
  ans: number;
  matrixA: number[][];
  matrixB: number[][];
  statX: number[];
  statY: number[];
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface EvalResult {
  value: number | ComplexNumber | number[][] | string;
  display: string;
  error?: string;
}

type TokenType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'LPAREN'
  | 'RPAREN'
  | 'CONSTANT'
  | 'VARIABLE'
  | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log', 'ln', 'log2', 'exp',
  'sqrt', 'cbrt', 'abs', 'ceil', 'floor', 'round',
  'fact', 'nCr', 'nPr',
  'deg', 'rad',
  'det', 'inv', 'trans',
]);

const CONSTANTS: Record<string, number> = {
  'π': Math.PI,
  'pi': Math.PI,
  'e': Math.E,
};

const OPERATORS: Record<string, { precedence: number; associativity: 'LEFT' | 'RIGHT' }> = {
  '+': { precedence: 2, associativity: 'LEFT' },
  '-': { precedence: 2, associativity: 'LEFT' },
  '*': { precedence: 3, associativity: 'LEFT' },
  '×': { precedence: 3, associativity: 'LEFT' },
  '/': { precedence: 3, associativity: 'LEFT' },
  '÷': { precedence: 3, associativity: 'LEFT' },
  '%': { precedence: 3, associativity: 'LEFT' },
  '^': { precedence: 4, associativity: 'RIGHT' },
};

/**
 * Tokenize input string into tokens
 */
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const char = expr[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (including decimals and scientific notation)
    if (/\d/.test(char)) {
      let numStr = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      // Handle scientific notation (e.g., 1e10, 1e-5)
      if (i < expr.length && /[eE]/.test(expr[i])) {
        numStr += expr[i];
        i++;
        if (i < expr.length && /[+-]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        while (i < expr.length && /\d/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Functions & Constants (multi-char identifiers)
    if (/[a-zA-Z]/.test(char)) {
      let ident = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
        ident += expr[i];
        i++;
      }

      if (FUNCTIONS.has(ident)) {
        tokens.push({ type: 'FUNCTION', value: ident });
      } else if (CONSTANTS[ident] !== undefined) {
        tokens.push({ type: 'CONSTANT', value: ident });
      } else if (ident === 'i') {
        tokens.push({ type: 'CONSTANT', value: 'i' });
      } else if (ident === 'Ans' || ident === 'M') {
        tokens.push({ type: 'VARIABLE', value: ident });
      } else {
        tokens.push({ type: 'VARIABLE', value: ident });
      }
      continue;
    }

    // Operators
    if ('+-*×÷/%^'.includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Comma (for function args, nCr, nPr)
    if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

/**
 * Shunting-yard algorithm: convert infix tokens to RPN (postfix)
 */
export function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER' || token.type === 'CONSTANT' || token.type === 'VARIABLE') {
      output.push(token);
    } else if (token.type === 'FUNCTION') {
      operators.push(token);
    } else if (token.type === 'COMMA') {
      while (operators.length > 0 && operators[operators.length - 1].type !== 'LPAREN') {
        output.push(operators.pop()!);
      }
    } else if (token.type === 'OPERATOR') {
      const prec = OPERATORS[token.value]?.precedence || 0;
      const assoc = OPERATORS[token.value]?.associativity || 'LEFT';

      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === 'OPERATOR'
      ) {
        const topOp = operators[operators.length - 1];
        const topPrec = OPERATORS[topOp.value]?.precedence || 0;

        if (
          topPrec > prec ||
          (topPrec === prec && assoc === 'LEFT')
        ) {
          output.push(operators.pop()!);
        } else {
          break;
        }
      }
      operators.push(token);
    } else if (token.type === 'LPAREN') {
      operators.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type !== 'LPAREN'
      ) {
        output.push(operators.pop()!);
      }
      if (operators.length > 0) {
        operators.pop(); // remove LPAREN
      }
      if (
        operators.length > 0 &&
        operators[operators.length - 1].type === 'FUNCTION'
      ) {
        output.push(operators.pop()!);
      }
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return output;
}

/**
 * RPN Evaluator - evaluate postfix expression
 */
function evaluateRPN(rpn: Token[], ctx: CalcContext): number | ComplexNumber {
  const stack: (number | ComplexNumber)[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'CONSTANT') {
      if (token.value === 'i') {
        stack.push({ re: 0, im: 1 });
      } else if (token.value === 'π' || token.value === 'pi') {
        stack.push(Math.PI);
      } else if (token.value === 'e') {
        stack.push(Math.E);
      } else {
        stack.push(CONSTANTS[token.value] || 0);
      }
    } else if (token.type === 'VARIABLE') {
      if (token.value === 'Ans') {
        stack.push(ctx.ans);
      } else if (token.value === 'M') {
        stack.push(ctx.memory);
      } else {
        stack.push(0);
      }
    } else if (token.type === 'OPERATOR') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error('Invalid expression');
      }
      const result = applyOperator(token.value, a, b);
      stack.push(result);
    } else if (token.type === 'FUNCTION') {
      const arg = stack.pop();
      if (arg === undefined) {
        throw new Error('Invalid function call');
      }
      const result = applyFunction(token.value, arg, ctx.angleUnit);
      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

/**
 * Apply binary operators
 */
function applyOperator(
  op: string,
  a: number | ComplexNumber,
  b: number | ComplexNumber
): number | ComplexNumber {
  const isComplexA = typeof a === 'object';
  const isComplexB = typeof b === 'object';

  if (!isComplexA && !isComplexB) {
    const na = a as number;
    const nb = b as number;

    switch (op) {
      case '+':
        return na + nb;
      case '-':
        return na - nb;
      case '*':
      case '×':
        return na * nb;
      case '/':
      case '÷':
        if (nb === 0) throw new Error('Division by zero');
        return na / nb;
      case '%':
        return na % nb;
      case '^':
        return Math.pow(na, nb);
      default:
        return 0;
    }
  }

  // Complex number arithmetic
  const ca = isComplexA ? (a as ComplexNumber) : { re: a as number, im: 0 };
  const cb = isComplexB ? (b as ComplexNumber) : { re: b as number, im: 0 };

  switch (op) {
    case '+':
      return { re: ca.re + cb.re, im: ca.im + cb.im };
    case '-':
      return { re: ca.re - cb.re, im: ca.im - cb.im };
    case '*':
    case '×':
      return {
        re: ca.re * cb.re - ca.im * cb.im,
        im: ca.re * cb.im + ca.im * cb.re,
      };
    case '/':
    case '÷': {
      const denom = cb.re * cb.re + cb.im * cb.im;
      if (denom === 0) throw new Error('Division by zero');
      return {
        re: (ca.re * cb.re + ca.im * cb.im) / denom,
        im: (ca.im * cb.re - ca.re * cb.im) / denom,
      };
    }
    case '^':
      if (typeof b === 'number') {
        // (a+bi)^n for real n
        const magnitude = Math.sqrt(ca.re * ca.re + ca.im * ca.im);
        const angle = Math.atan2(ca.im, ca.re);
        const newMagnitude = Math.pow(magnitude, b);
        const newAngle = angle * b;
        return {
          re: newMagnitude * Math.cos(newAngle),
          im: newMagnitude * Math.sin(newAngle),
        };
      }
      return ca;
    default:
      return ca;
  }
}

/**
 * Apply unary functions
 */
function applyFunction(
  func: string,
  arg: number | ComplexNumber,
  angleUnit: AngleUnit
): number | ComplexNumber {
  const isComplex = typeof arg === 'object';

  if (isComplex && !['abs', 'exp', 'ln', 'sqrt'].includes(func)) {
    // Most functions don't support complex - return error implicitly
    return arg;
  }

  const val = isComplex ? (arg as ComplexNumber).re : (arg as number);

  // Angle conversion helpers
  const toRad = (v: number) => angleUnit === 'DEG' ? (v * Math.PI) / 180 : v;
  const toDeg = (v: number) => angleUnit === 'DEG' ? (v * 180) / Math.PI : v;

  switch (func) {
    case 'sin':
      return Math.sin(toRad(val));
    case 'cos':
      return Math.cos(toRad(val));
    case 'tan':
      return Math.tan(toRad(val));
    case 'asin':
      return toDeg(Math.asin(Math.max(-1, Math.min(1, val))));
    case 'acos':
      return toDeg(Math.acos(Math.max(-1, Math.min(1, val))));
    case 'atan':
      return toDeg(Math.atan(val));
    case 'sinh':
      return Math.sinh(val);
    case 'cosh':
      return Math.cosh(val);
    case 'tanh':
      return Math.tanh(val);
    case 'log':
      if (val <= 0) throw new Error('log of non-positive number');
      return Math.log10(val);
    case 'ln':
      if (val <= 0) throw new Error('ln of non-positive number');
      return Math.log(val);
    case 'log2':
      if (val <= 0) throw new Error('log2 of non-positive number');
      return Math.log2(val);
    case 'exp':
      return Math.exp(val);
    case 'sqrt':
      if (val < 0 && !isComplex) {
        // Return complex result for negative sqrt
        return { re: 0, im: Math.sqrt(-val) };
      }
      return Math.sqrt(Math.max(0, val));
    case 'cbrt':
      return Math.cbrt(val);
    case 'abs':
      if (isComplex) {
        const c = arg as ComplexNumber;
        return Math.sqrt(c.re * c.re + c.im * c.im);
      }
      return Math.abs(val);
    case 'ceil':
      return Math.ceil(val);
    case 'floor':
      return Math.floor(val);
    case 'round':
      return Math.round(val);
    case 'fact':
      return factorial(Math.round(val));
    case 'deg':
      return toDeg(val);
    case 'rad':
      return toRad(val);
    default:
      return val;
  }
}

/**
 * Factorial
 */
function factorial(n: number): number {
  if (n < 0) throw new Error('Negative factorial');
  if (n > 170) return Infinity;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Combination nCr
 */
export function nCr(n: number, r: number): number {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/**
 * Permutation nPr
 */
export function nPr(n: number, r: number): number {
  if (r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= n - i;
  }
  return result;
}

/**
 * Format complex number for display
 */
function formatComplex(c: ComplexNumber, precision: number = 6): string {
  const re = Math.round(c.re * Math.pow(10, precision)) / Math.pow(10, precision);
  const im = Math.round(c.im * Math.pow(10, precision)) / Math.pow(10, precision);

  if (im === 0) return re.toString();
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }

  const sign = im > 0 ? '+' : '';
  if (im === 1) return `${re}+i`;
  if (im === -1) return `${re}-i`;
  return `${re}${sign}${im}i`;
}

/**
 * Main evaluation function
 */
export function evaluate(expr: string, ctx: CalcContext): EvalResult {
  try {
    if (!expr || expr.trim() === '') {
      return { value: 0, display: '0' };
    }

    const tokens = tokenize(expr);
    if (tokens.length === 0) {
      return { value: 0, display: '0' };
    }

    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn, ctx);

    let display = '';
    if (typeof result === 'number') {
      const precision = 10;
      display = Math.abs(result) < 1e-10 ? '0' :
                Math.abs(result) > 1e10 ? result.toExponential(6) :
                Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision) + '';
    } else if (typeof result === 'object' && 're' in result) {
      display = formatComplex(result);
    } else {
      display = '';
    }

    return { value: result, display };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Invalid expression';
    return { value: 0, display: '', error: msg };
  }
}

/**
 * Matrix determinant (2x2, 3x3)
 */
export function matrixDet(m: number[][]): number {
  if (m.length === 2 && m[0].length === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }
  if (m.length === 3 && m[0].length === 3) {
    const a = m[0][0], b = m[0][1], c = m[0][2];
    const d = m[1][0], e = m[1][1], f = m[1][2];
    const g = m[2][0], h = m[2][1], i = m[2][2];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  }
  return 0;
}

/**
 * Matrix transpose
 */
export function matrixTranspose(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const result: number[][] = [];
  for (let j = 0; j < cols; j++) {
    const row: number[] = [];
    for (let i = 0; i < rows; i++) {
      row.push(m[i][j]);
    }
    result.push(row);
  }
  return result;
}

/**
 * Matrix addition
 */
export function matrixAdd(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = a[0].length;
  const result: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(a[i][j] + b[i][j]);
    }
    result.push(row);
  }
  return result;
}

/**
 * Matrix multiplication
 */
export function matrixMul(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const inner = a[0].length;
  const result: number[][] = [];

  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += a[i][k] * b[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }

  return result;
}

/**
 * Matrix inverse (2x2 only, using Cramer's rule)
 */
export function matrixInverse(m: number[][]): number[][] {
  if (m.length !== 2 || m[0].length !== 2) {
    throw new Error('Only 2x2 matrices supported for inversion');
  }

  const det = matrixDet(m);
  if (Math.abs(det) < 1e-10) {
    throw new Error('Matrix is singular (determinant = 0)');
  }

  const a = m[0][0], b = m[0][1];
  const c = m[1][0], d = m[1][1];

  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}

/**
 * Linear regression
 */
export function computeRegression(x: number[], y: number[]): {
  slope: number;
  intercept: number;
  r: number;
} {
  const n = x.length;
  if (n < 2) {
    return { slope: 0, intercept: 0, r: 0 };
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
    sumYY += y[i] * y[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (coefficient of determination)
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r = denominator === 0 ? 0 : numerator / denominator;

  return { slope, intercept, r };
}

/**
 * Descriptive statistics
 */
export function computeStats(data: number[]): {
  n: number;
  mean: number;
  variance: number;
  stddev: number;
  min: number;
  max: number;
  sum: number;
} {
  const n = data.length;
  if (n === 0) {
    return { n: 0, mean: 0, variance: 0, stddev: 0, min: 0, max: 0, sum: 0 };
  }

  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  let variance = 0;
  for (const val of data) {
    variance += Math.pow(val - mean, 2);
  }
  variance /= n;

  return {
    n,
    mean,
    variance,
    stddev: Math.sqrt(variance),
    min: Math.min(...data),
    max: Math.max(...data),
    sum,
  };
}
