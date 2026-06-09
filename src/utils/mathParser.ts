/**
 * Math expression parser and evaluator.
 * Supports tokenization, recursive-descent parsing, and AST evaluation.
 * Handles operators (+, -, *, /, ^, %), parentheses, functions (sin, cos, tan, sqrt, log, ln, abs),
 * variables (e.g., 'x' for graphing), and constants (pi, e).
 */

type TokenType =
  | "NUMBER"
  | "OPERATOR"
  | "LPAREN"
  | "RPAREN"
  | "IDENTIFIER"
  | "EOF";

interface Token {
  type: TokenType;
  value: string;
}

interface ASTNode {
  type: string;
  value?: string;
  left?: ASTNode;
  right?: ASTNode;
  argument?: ASTNode;
}

/**
 * Tokenizes an input math string.
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Clean the input (replace visual characters)
  let cleanInput = input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/\s+/g, "");

  while (i < cleanInput.length) {
    const char = cleanInput[i];

    // Numbers (including decimals)
    if (/[0-9.]/.test(char)) {
      let numStr = "";
      // Gather digits and at most one decimal point
      while (i < cleanInput.length && /[0-9.]/.test(cleanInput[i])) {
        numStr += cleanInput[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: numStr });
      continue;
    }

    // Operators
    if (["+", "-", "*", "/", "^", "%"].includes(char)) {
      tokens.push({ type: "OPERATOR", value: char });
      i++;
      continue;
    }

    // Parentheses
    if (char === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }

    // Identifiers (functions or variables)
    if (/[a-zA-Z]/.test(char)) {
      let ident = "";
      while (i < cleanInput.length && /[a-zA-Z]/.test(cleanInput[i])) {
        ident += cleanInput[i];
        i++;
      }
      tokens.push({ type: "IDENTIFIER", value: ident });
      continue;
    }

    // Skip unrecognized characters
    i++;
  }

  tokens.push({ type: "EOF", value: "" });
  return tokens;
}

/**
 * Parses tokens into an Abstract Syntax Tree (AST).
 * Uses a classic recursive descent parsing algorithm.
 */
export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private consume(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(`Expected token of type ${type}, got ${token.type}`);
    }
    this.current++;
    return token;
  }

  private match(type: TokenType, value?: string): boolean {
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    this.current++;
    return true;
  }

  public parse(): ASTNode {
    const node = this.expression();
    if (this.peek().type !== "EOF") {
      throw new Error("Unexpected tokens at end of expression");
    }
    return node;
  }

  // Precedence level 1: Addition and Subtraction
  private expression(): ASTNode {
    let node = this.term();

    while (true) {
      if (this.match("OPERATOR", "+")) {
        node = { type: "BinaryExpression", value: "+", left: node, right: this.term() };
      } else if (this.match("OPERATOR", "-")) {
        node = { type: "BinaryExpression", value: "-", left: node, right: this.term() };
      } else {
        break;
      }
    }

    return node;
  }

  // Precedence level 2: Multiplication, Division, and Modulo
  private term(): ASTNode {
    let node = this.exponent();

    while (true) {
      if (this.match("OPERATOR", "*")) {
        node = { type: "BinaryExpression", value: "*", left: node, right: this.exponent() };
      } else if (this.match("OPERATOR", "/")) {
        node = { type: "BinaryExpression", value: "/", left: node, right: this.exponent() };
      } else if (this.match("OPERATOR", "%")) {
        node = { type: "BinaryExpression", value: "%", left: node, right: this.exponent() };
      } else {
        break;
      }
    }

    return node;
  }

  // Precedence level 3: Exponentiation (Right-associative)
  private exponent(): ASTNode {
    let node = this.unary();

    if (this.match("OPERATOR", "^")) {
      node = { type: "BinaryExpression", value: "^", left: node, right: this.exponent() };
    }

    return node;
  }

  // Precedence level 4: Unary operators (-x, +x)
  private unary(): ASTNode {
    if (this.match("OPERATOR", "-")) {
      return { type: "UnaryExpression", value: "-", argument: this.unary() };
    }
    if (this.match("OPERATOR", "+")) {
      return this.unary();
    }
    return this.primary();
  }

  // Precedence level 5: Primaries (Numbers, Variables, Functions, Parentheses)
  private primary(): ASTNode {
    const token = this.peek();

    if (this.match("NUMBER")) {
      return { type: "NumericLiteral", value: token.value };
    }

    if (this.match("IDENTIFIER")) {
      const name = token.value.toLowerCase();

      // Constants
      if (name === "pi") {
        return { type: "NumericLiteral", value: Math.PI.toString() };
      }
      if (name === "e") {
        return { type: "NumericLiteral", value: Math.E.toString() };
      }

      // Variable x
      if (name === "x") {
        return { type: "Identifier", value: "x" };
      }

      // Function calls, e.g., sin(x)
      if (this.peek().type === "LPAREN") {
        this.consume("LPAREN");
        const arg = this.expression();
        this.consume("RPAREN");
        return { type: "CallExpression", value: name, argument: arg };
      }

      throw new Error(`Unknown identifier: ${token.value}`);
    }

    if (this.match("LPAREN")) {
      const node = this.expression();
      this.consume("RPAREN");
      return node;
    }

    throw new Error(`Unexpected token: ${token.value || token.type}`);
  }
}

/**
 * Evaluates an AST node down to a single numeric value.
 */
export function evaluateAST(node: ASTNode, variables: Record<string, number> = {}): number {
  switch (node.type) {
    case "NumericLiteral":
      return parseFloat(node.value!);

    case "Identifier":
      if (node.value! in variables) {
        return variables[node.value!];
      }
      throw new Error(`Variable '${node.value}' is not defined`);

    case "UnaryExpression": {
      const argVal = evaluateAST(node.argument!, variables);
      if (node.value === "-") return -argVal;
      return argVal;
    }

    case "BinaryExpression": {
      const leftVal = evaluateAST(node.left!, variables);
      const rightVal = evaluateAST(node.right!, variables);

      switch (node.value) {
        case "+":
          return leftVal + rightVal;
        case "-":
          return leftVal - rightVal;
        case "*":
          return leftVal * rightVal;
        case "/":
          if (rightVal === 0) throw new Error("Division by zero");
          return leftVal / rightVal;
        case "%":
          return leftVal % rightVal;
        case "^":
          return Math.pow(leftVal, rightVal);
        default:
          throw new Error(`Unknown operator: ${node.value}`);
      }
    }

    case "CallExpression": {
      const argVal = evaluateAST(node.argument!, variables);
      switch (node.value) {
        case "sin":
          return Math.sin(argVal);
        case "cos":
          return Math.cos(argVal);
        case "tan":
          return Math.tan(argVal);
        case "sqrt":
          if (argVal < 0) throw new Error("Square root of negative number");
          return Math.sqrt(argVal);
        case "log":
          if (argVal <= 0) throw new Error("Logarithm of non-positive number");
          return Math.log10(argVal);
        case "ln":
          if (argVal <= 0) throw new Error("Natural logarithm of non-positive number");
          return Math.log(argVal);
        case "abs":
          return Math.abs(argVal);
        default:
          throw new Error(`Unknown function: ${node.value}`);
      }
    }

    default:
      throw new Error(`Unknown AST node type: ${node.type}`);
  }
}

/**
 * Convenient utility function to parse and evaluate an expression directly.
 */
export function evaluate(expression: string, variables: Record<string, number> = {}): number {
  if (!expression.trim()) return 0;
  const tokens = tokenize(expression);
  const parser = new Parser(tokens);
  const ast = parser.parse();
  return evaluateAST(ast, variables);
}
