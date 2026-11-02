export interface BooleanStep {
  step: number;
  expression: string;
  rule: string;
  explanation: string;
}

export interface ParseResult {
  tokens: string[];
  rpn: string[];
  variables: string[];
  isValid: boolean;
  error?: string;
}

export class BooleanEngine {
  /**
   * Preprocesses and normalizes raw user Boolean expressions.
   * Supports: A AND B, A*B, AB, A', !A, ~A, A OR B, A+B, A XOR B, A^B, A XNOR B
   */
  static normalizeExpression(raw: string): string {
    let expr = raw.trim().toUpperCase();

    // Word operators to symbols
    expr = expr.replace(/\bXNOR\b/g, '@');
    expr = expr.replace(/\bXOR\b/g, '^');
    expr = expr.replace(/\bAND\b/g, '*');
    expr = expr.replace(/\bOR\b/g, '+');
    expr = expr.replace(/\bNOT\b/g, '!');
    expr = expr.replace(/¬/g, '!');
    expr = expr.replace(/~/g, '!');
    expr = expr.replace(/·/g, '*');
    expr = expr.replace(/•/g, '*');
    expr = expr.replace(/⊕/g, '^');
    expr = expr.replace(/⊙/g, '@');

    // Convert postfix primes (e.g. A' or (A+B)') to prefix !
    // Loop until no single quotes remain
    while (expr.includes("'")) {
      // Case 1: (group)' -> !(group)
      const groupPrime = /(\([^()]+\))'/;
      if (groupPrime.test(expr)) {
        expr = expr.replace(groupPrime, '!$1');
        continue;
      }
      // Case 2: Variable' -> !Variable
      const varPrime = /([A-Z0-9])'/;
      if (varPrime.test(expr)) {
        expr = expr.replace(varPrime, '!$1');
        continue;
      }
      // If none matched, break to avoid infinite loop
      break;
    }

    // Insert explicit multiplication for adjacent variables/parentheses
    // e.g. AB -> A*B, A(B) -> A*(B), (A)(B) -> (A)*(B), )A -> )*A
    expr = expr.replace(/\s+/g, ''); // strip spaces
    let withMult = '';
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      withMult += c;
      if (i < expr.length - 1) {
        const next = expr[i + 1];
        const isCurrentOperand = /[A-Z0-9)]/.test(c);
        const isNextOperand = /[A-Z0-9(!]/.test(next);

        if (isCurrentOperand && isNextOperand && !(c === '!' || next === '!')) {
          withMult += '*';
        } else if (c === ')' && next === '!') {
          withMult += '*';
        } else if (/[A-Z0-9]/.test(c) && next === '!') {
          withMult += '*';
        }
      }
    }

    return withMult;
  }

  /**
   * Parses normalized expression into Reverse Polish Notation (RPN) using Shunting-Yard.
   */
  static parse(rawExpr: string): ParseResult {
    const normalized = this.normalizeExpression(rawExpr);
    if (!normalized) {
      return { tokens: [], rpn: [], variables: [], isValid: false, error: 'Empty expression' };
    }

    const precedence: Record<string, number> = {
      '!': 4,
      '*': 3,
      '^': 2,
      '@': 2,
      '+': 1
    };

    const isRightAssociative: Record<string, boolean> = {
      '!': true
    };

    const outputQueue: string[] = [];
    const operatorStack: string[] = [];
    const variablesSet = new Set<string>();

    let i = 0;
    let expectingOperand = true;

    while (i < normalized.length) {
      const char = normalized[i];

      if (/[A-Z]/.test(char)) {
        outputQueue.push(char);
        variablesSet.add(char);
        expectingOperand = false;
        i++;
      } else if (char === '0' || char === '1') {
        outputQueue.push(char);
        expectingOperand = false;
        i++;
      } else if (char === '(') {
        operatorStack.push(char);
        expectingOperand = true;
        i++;
      } else if (char === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0) {
          return { tokens: [], rpn: [], variables: [], isValid: false, error: 'Mismatched parentheses' };
        }
        operatorStack.pop(); // discard '('
        expectingOperand = false;
        i++;
      } else if (char in precedence) {
        // Operator
        const op1 = char;
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          ((!isRightAssociative[op1] && precedence[operatorStack[operatorStack.length - 1]] >= precedence[op1]) ||
            (isRightAssociative[op1] && precedence[operatorStack[operatorStack.length - 1]] > precedence[op1]))
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(op1);
        expectingOperand = true;
        i++;
      } else {
        return { tokens: [], rpn: [], variables: [], isValid: false, error: `Invalid character: ${char}` };
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op === '(' || op === ')') {
        return { tokens: [], rpn: [], variables: [], isValid: false, error: 'Mismatched parentheses' };
      }
      outputQueue.push(op);
    }

    const vars = Array.from(variablesSet).sort();
    return {
      tokens: normalized.split(''),
      rpn: outputQueue,
      variables: vars,
      isValid: true
    };
  }

  /**
   * Evaluates parsed RPN with specific variable assignments (e.g. { A: 1, B: 0 }).
   */
  static evaluateRPN(rpn: string[], assignments: Record<string, number>): number {
    const stack: number[] = [];

    for (const token of rpn) {
      if (token === '0') {
        stack.push(0);
      } else if (token === '1') {
        stack.push(1);
      } else if (/[A-Z]/.test(token)) {
        stack.push(assignments[token] ?? 0);
      } else if (token === '!') {
        if (stack.length < 1) throw new Error('Evaluation error: missing operand for NOT');
        const val = stack.pop()!;
        stack.push(val === 1 ? 0 : 1);
      } else if (token === '*' || token === '+' || token === '^' || token === '@') {
        if (stack.length < 2) throw new Error(`Evaluation error: missing operands for ${token}`);
        const b = stack.pop()!;
        const a = stack.pop()!;
        if (token === '*') stack.push(a & b);
        else if (token === '+') stack.push(a | b);
        else if (token === '^') stack.push(a ^ b);
        else if (token === '@') stack.push((a ^ b) === 0 ? 1 : 0);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Evaluation error: malformed RPN expression');
    }

    return stack[0];
  }

  /**
   * Generates step-by-step simplification based on known Boolean Algebra laws.
   */
  static simplifyWithSteps(rawExpr: string): { simplified: string; steps: BooleanStep[] } {
    const steps: BooleanStep[] = [];
    let current = rawExpr.trim();

    steps.push({
      step: 1,
      expression: current,
      rule: 'Original Expression',
      explanation: 'Starting Boolean function representation.'
    });

    let stepNum = 2;

    // Double negation: !!A or A'' -> A
    if (/\!\!([A-Z])/.test(current) || /([A-Z])''/.test(current)) {
      current = current.replace(/\!\!([A-Z])/g, '$1').replace(/([A-Z])''/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Involution / Double Negation Law',
        explanation: '(A\')\' = A: Negating a variable twice yields the original variable.'
      });
    }

    // Annulment / Dominance: A · 0 = 0 or A + 1 = 1
    if (/\b([A-Z])\s*\*\s*0\b/.test(current) || /\b0\s*\*\s*([A-Z])\b/.test(current)) {
      current = current.replace(/\b([A-Z])\s*\*\s*0\b/g, '0').replace(/\b0\s*\*\s*([A-Z])\b/g, '0');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Dominance (Annulment) Law',
        explanation: 'A · 0 = 0: Any term ANDed with 0 is always 0.'
      });
    }

    if (/\b([A-Z])\s*\+\s*1\b/.test(current) || /\b1\s*\+\s*([A-Z])\b/.test(current)) {
      current = current.replace(/\b([A-Z])\s*\+\s*1\b/g, '1').replace(/\b1\s*\+\s*([A-Z])\b/g, '1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Dominance (Annulment) Law',
        explanation: 'A + 1 = 1: Any term ORed with 1 is always 1.'
      });
    }

    // Identity: A · 1 = A or A + 0 = A
    if (/\b([A-Z])\s*\*\s*1\b/.test(current) || /\b1\s*\*\s*([A-Z])\b/.test(current)) {
      current = current.replace(/\b([A-Z])\s*\*\s*1\b/g, '$1').replace(/\b1\s*\*\s*([A-Z])\b/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Identity Law',
        explanation: 'A · 1 = A: 1 is the identity element for the AND operation.'
      });
    }

    if (/\b([A-Z])\s*\+\s*0\b/.test(current) || /\b0\s*\+\s*([A-Z])\b/.test(current)) {
      current = current.replace(/\b([A-Z])\s*\+\s*0\b/g, '$1').replace(/\b0\s*\+\s*([A-Z])\b/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Identity Law',
        explanation: 'A + 0 = A: 0 is the identity element for the OR operation.'
      });
    }

    // Complement Law: A · A' = 0, A + A' = 1
    if (/([A-Z])\s*\*\s*(!\1|\1')/.test(current) || /(!([A-Z])|([A-Z])')\s*\*\s*\2/.test(current)) {
      current = current.replace(/([A-Z])\s*\*\s*(!\1|\1')/g, '0').replace(/(!([A-Z])|([A-Z])')\s*\*\s*\2/g, '0');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Complement Law',
        explanation: 'A · A\' = 0: A variable AND its complement can never both be 1.'
      });
    }

    // Idempotent: A + A = A, A · A = A
    if (/([A-Z])\s*\+\s*\1\b/.test(current)) {
      current = current.replace(/([A-Z])\s*\+\s*\1\b/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Idempotent Law',
        explanation: 'A + A = A: Repeating a variable with OR does not alter its truth value.'
      });
    }

    if (/([A-Z])\s*\*\s*\1\b/.test(current)) {
      current = current.replace(/([A-Z])\s*\*\s*\1\b/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Idempotent Law',
        explanation: 'A · A = A: Repeating a variable with AND does not alter its truth value.'
      });
    }

    // Absorption Law: A + AB = A, A(A + B) = A
    if (/([A-Z])\s*\+\s*\1([A-Z])/.test(current)) {
      current = current.replace(/([A-Z])\s*\+\s*\1([A-Z])/g, '$1');
      steps.push({
        step: stepNum++,
        expression: current,
        rule: 'Absorption Law',
        explanation: 'A + A·B = A · (1 + B) = A · 1 = A.'
      });
    }

    // Final simplified form
    if (steps.length === 1) {
      steps.push({
        step: 2,
        expression: current,
        rule: 'Minimized Form',
        explanation: 'Expression is already in its irreducible standard algebraic form.'
      });
    }

    return {
      simplified: current,
      steps
    };
  }
}

