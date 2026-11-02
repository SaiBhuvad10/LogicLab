export type Radix = 2 | 8 | 10 | 16;
export type RadixName = 'BIN' | 'OCT' | 'DEC' | 'HEX';

export interface ConversionStep {
  step: number;
  description: string;
  expression: string;
  result: string;
}

export interface ConversionResult {
  fromBase: Radix;
  toBase: Radix;
  input: string;
  output: string;
  steps: ConversionStep[];
  binaryVal: string;
  decimalVal: number;
  octalVal: string;
  hexVal: string;
}

export interface BinaryArithmeticResult {
  operandA: string;
  operandB: string;
  operation: 'ADD' | 'SUB';
  resultBits: string;
  carryBits: string;
  borrowBits?: string;
  overflow: boolean;
  decimalResult: number;
  explanation: string;
}

export interface SignedRepresentationResult {
  decimal: number;
  bitLength: number;
  signMagnitude: string;
  onesComplement: string;
  twosComplement: string;
  rangeMin: number;
  rangeMax: number;
  isNegative: boolean;
}

export class NumberSystemEngine {
  static isValidForBase(value: string, base: Radix): boolean {
    const val = value.trim().toUpperCase();
    if (!val) return false;
    switch (base) {
      case 2:
        return /^[01]+$/.test(val);
      case 8:
        return /^[0-7]+$/.test(val);
      case 10:
        return /^-?\d+$/.test(val);
      case 16:
        return /^[0-9A-F]+$/.test(val);
      default:
        return false;
    }
  }

  /**
   * Converts any value from source base to all 4 bases with detailed steps.
   */
  static convert(value: string, fromBase: Radix, toBase: Radix): ConversionResult {
    const cleanVal = value.trim().toUpperCase();
    if (!this.isValidForBase(cleanVal, fromBase)) {
      throw new Error(`Invalid input "${cleanVal}" for base ${fromBase}`);
    }

    const steps: ConversionStep[] = [];
    let decimalVal = 0;

    // Step 1: Convert source base to Decimal (if not already decimal)
    if (fromBase === 10) {
      decimalVal = parseInt(cleanVal, 10);
      steps.push({
        step: 1,
        description: 'Decimal Input',
        expression: `Value is already in base 10: ${decimalVal}`,
        result: decimalVal.toString()
      });
    } else {
      const chars = cleanVal.split('');
      const n = chars.length;
      let expTerms: string[] = [];
      let total = 0;

      chars.forEach((c, idx) => {
        const power = n - 1 - idx;
        const digitVal = parseInt(c, fromBase);
        total += digitVal * Math.pow(fromBase, power);
        expTerms.push(`(${c} × ${fromBase}^${power})`);
      });

      decimalVal = total;
      steps.push({
        step: 1,
        description: `Convert Base ${fromBase} to Base 10 (Positional Weighting)`,
        expression: `${expTerms.join(' + ')}`,
        result: `= ${decimalVal}`
      });
    }

    // Step 2: Convert Decimal to Target Base (Repeated division)
    let output = '';
    if (toBase === 10) {
      output = decimalVal.toString();
    } else {
      let temp = Math.abs(decimalVal);
      if (temp === 0) {
        output = '0';
        steps.push({
          step: 2,
          description: `Convert 0 to Base ${toBase}`,
          expression: '0 in any base',
          result: '0'
        });
      } else {
        const remainders: string[] = [];
        let stepCount = 2;
        while (temp > 0) {
          const quotient = Math.floor(temp / toBase);
          const remainder = temp % toBase;
          const remStr = remainder.toString(toBase).toUpperCase();
          remainders.unshift(remStr);

          steps.push({
            step: stepCount++,
            description: `Divide by ${toBase}`,
            expression: `${temp} ÷ ${toBase} = ${quotient} with remainder ${remStr}`,
            result: `Remainder: ${remStr}`
          });
          temp = quotient;
        }
        output = remainders.join('');
        steps.push({
          step: stepCount,
          description: `Assemble remainders from bottom to top (MSB to LSB)`,
          expression: `Result in Base ${toBase}`,
          result: output
        });
      }
    }

    const bin = Math.abs(decimalVal).toString(2);
    const oct = Math.abs(decimalVal).toString(8);
    const dec = decimalVal;
    const hex = Math.abs(decimalVal).toString(16).toUpperCase();

    return {
      fromBase,
      toBase,
      input: cleanVal,
      output,
      steps,
      binaryVal: bin,
      decimalVal: dec,
      octalVal: oct,
      hexVal: hex
    };
  }

  /**
   * Generates 1's complement, 2's complement, and signed magnitude.
   */
  static getSignedRepresentations(decimal: number, bitLength: number = 8): SignedRepresentationResult {
    const rangeMin = -Math.pow(2, bitLength - 1);
    const rangeMax = Math.pow(2, bitLength - 1) - 1;
    const isNegative = decimal < 0;
    const absVal = Math.abs(decimal);

    // Unsigned magnitude representation
    const magBin = absVal.toString(2).padStart(bitLength, '0');

    let signMagnitude = magBin;
    let onesComplement = magBin;
    let twosComplement = magBin;

    if (isNegative) {
      // Sign-Magnitude: MSB is 1
      signMagnitude = '1' + absVal.toString(2).padStart(bitLength - 1, '0');

      // 1's Complement: Invert all bits of positive magnitude
      const positiveBin = absVal.toString(2).padStart(bitLength, '0');
      onesComplement = positiveBin
        .split('')
        .map(b => (b === '1' ? '0' : '1'))
        .join('');

      // 2's Complement: 1's complement + 1
      const onesVal = parseInt(onesComplement, 2);
      const twosVal = (onesVal + 1) & ((1 << bitLength) - 1);
      twosComplement = twosVal.toString(2).padStart(bitLength, '0');
    }

    return {
      decimal,
      bitLength,
      signMagnitude,
      onesComplement,
      twosComplement,
      rangeMin,
      rangeMax,
      isNegative
    };
  }

  /**
   * Performs binary addition bit-by-bit with carry tracking.
   */
  static addBinary(binA: string, binB: string, bitLength: number = 8): BinaryArithmeticResult {
    const aPadded = binA.padStart(bitLength, '0').slice(-bitLength);
    const bPadded = binB.padStart(bitLength, '0').slice(-bitLength);

    const carries: number[] = new Array(bitLength + 1).fill(0);
    const sumBits: number[] = new Array(bitLength).fill(0);

    for (let i = bitLength - 1; i >= 0; i--) {
      const bitA = parseInt(aPadded[i], 10);
      const bitB = parseInt(bPadded[i], 10);
      const cin = carries[i + 1];

      const sum = bitA ^ bitB ^ cin;
      const cout = (bitA & bitB) | (cin & (bitA ^ bitB));

      sumBits[i] = sum;
      carries[i] = cout;
    }

    const resultBits = sumBits.join('');
    const carryBits = carries.slice(0, bitLength).join('');
    const overflow = carries[0] === 1;

    const valA = parseInt(binA, 2);
    const valB = parseInt(binB, 2);

    return {
      operandA: aPadded,
      operandB: bPadded,
      operation: 'ADD',
      resultBits,
      carryBits,
      overflow,
      decimalResult: valA + valB,
      explanation: overflow
        ? `Carry generated out of MSB bit ${bitLength - 1}. For an unsigned ${bitLength}-bit register, this indicates overflow.`
        : `Addition completed with no MSB overflow. Result fits in ${bitLength} bits.`
    };
  }

  /**
   * Performs binary subtraction via 2's complement addition: A - B = A + (~B + 1).
   */
  static subtractBinary(binA: string, binB: string, bitLength: number = 8): BinaryArithmeticResult {
    const aPadded = binA.padStart(bitLength, '0').slice(-bitLength);
    const bPadded = binB.padStart(bitLength, '0').slice(-bitLength);

    // 2's complement of B:
    const invertedB = bPadded.split('').map(b => (b === '1' ? '0' : '1')).join('');
    const twosCompB = ((parseInt(invertedB, 2) + 1) & ((1 << bitLength) - 1))
      .toString(2)
      .padStart(bitLength, '0');

    // Add A and twosCompB
    const addRes = this.addBinary(aPadded, twosCompB, bitLength);

    const valA = parseInt(binA, 2);
    const valB = parseInt(binB, 2);
    const diff = valA - valB;

    return {
      operandA: aPadded,
      operandB: bPadded,
      operation: 'SUB',
      resultBits: addRes.resultBits,
      carryBits: addRes.carryBits,
      overflow: diff < 0,
      decimalResult: diff,
      explanation:
        diff >= 0
          ? `Subtraction performed using 2's complement: A + (2's comp of B). End carry ignored, result is positive.`
          : `A < B: Result is negative (${diff}). The raw bits represent the 2's complement of the magnitude.`
    };
  }
}

