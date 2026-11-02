export interface CombinationalCircuitDef {
  id: string;
  name: string;
  category: 'Adder/Subtractor' | 'Multiplexer/Demultiplexer' | 'Decoder/Encoder' | 'Arithmetic/ALU';
  description: string;
  equations: string[];
  inputs: { id: string; label: string; defaultValue: number; options?: number[] }[];
  outputs: { id: string; label: string }[];
  truthTableHeaders: string[];
  truthTableRows: { inputs: number[]; outputs: number[] }[];
}

export class CombinationalEngine {
  // 1. Half Adder
  static evalHalfAdder(a: number, b: number) {
    const sum = a ^ b;
    const carry = a & b;
    return { sum, carry };
  }

  // 2. Full Adder
  static evalFullAdder(a: number, b: number, cin: number) {
    const sum = a ^ b ^ cin;
    const cout = (a & b) | (cin & (a ^ b));
    return { sum, cout };
  }

  // 3. Half Subtractor
  static evalHalfSubtractor(a: number, b: number) {
    const diff = a ^ b;
    const borrow = (a === 0 && b === 1) ? 1 : 0;
    return { diff, borrow };
  }

  // 4. Full Subtractor
  static evalFullSubtractor(a: number, b: number, bin: number) {
    const diff = a ^ b ^ bin;
    const bout = ((a === 0 ? 1 : 0) & b) | (((a ^ b) === 0 ? 1 : 0) & bin);
    return { diff, bout };
  }

  // 5. 2:1 Multiplexer
  static evalMux2to1(d0: number, d1: number, s: number) {
    const y = s === 0 ? d0 : d1;
    return { y };
  }

  // 6. 4:1 Multiplexer
  static evalMux4to1(d0: number, d1: number, d2: number, d3: number, s1: number, s0: number) {
    const select = (s1 << 1) | s0;
    const data = [d0, d1, d2, d3];
    const y = data[select];
    return { y, select };
  }

  // 7. 1:2 Demultiplexer
  static evalDemux1to2(din: number, s: number) {
    const y0 = s === 0 ? din : 0;
    const y1 = s === 1 ? din : 0;
    return { y0, y1 };
  }

  // 8. 1:4 Demultiplexer
  static evalDemux1to4(din: number, s1: number, s0: number) {
    const select = (s1 << 1) | s0;
    return {
      y0: select === 0 ? din : 0,
      y1: select === 1 ? din : 0,
      y2: select === 2 ? din : 0,
      y3: select === 3 ? din : 0,
      select
    };
  }

  // 9. 2-to-4 Decoder
  static evalDecoder2to4(a: number, b: number, enable: number = 1) {
    if (enable === 0) return { y0: 0, y1: 0, y2: 0, y3: 0 };
    const sel = (a << 1) | b;
    return {
      y0: sel === 0 ? 1 : 0,
      y1: sel === 1 ? 1 : 0,
      y2: sel === 2 ? 1 : 0,
      y3: sel === 3 ? 1 : 0
    };
  }

  // 10. 3-to-8 Decoder
  static evalDecoder3to8(a: number, b: number, c: number, enable: number = 1) {
    const outputs = [0, 0, 0, 0, 0, 0, 0, 0];
    if (enable === 1) {
      const sel = (a << 2) | (b << 1) | c;
      outputs[sel] = 1;
    }
    return {
      y0: outputs[0],
      y1: outputs[1],
      y2: outputs[2],
      y3: outputs[3],
      y4: outputs[4],
      y5: outputs[5],
      y6: outputs[6],
      y7: outputs[7]
    };
  }

  // 11. 8-to-3 Priority Encoder
  static evalPriorityEncoder8to3(inputs: number[]) {
    // inputs D0 to D7, D7 highest priority
    let valid = 0;
    let code = 0;
    for (let i = 7; i >= 0; i--) {
      if (inputs[i] === 1) {
        valid = 1;
        code = i;
        break;
      }
    }
    return {
      y2: (code >> 2) & 1,
      y1: (code >> 1) & 1,
      y0: code & 1,
      valid,
      activeLine: valid ? code : -1
    };
  }

  // 12. 4-bit Digital Comparator
  static evalComparator(a: number, b: number) {
    const aGtB = a > b ? 1 : 0;
    const aEqB = a === b ? 1 : 0;
    const aLtB = a < b ? 1 : 0;
    return { aGtB, aEqB, aLtB };
  }

  // 13. 4-bit Look-Ahead Carry Adder (CLA)
  static evalCLA4Bit(aBits: number[], bBits: number[], cin: number) {
    // Generate Gi = Ai * Bi, Propagate Pi = Ai ^ Bi
    const g: number[] = [];
    const p: number[] = [];
    for (let i = 0; i < 4; i++) {
      g[i] = aBits[i] & bBits[i];
      p[i] = aBits[i] ^ bBits[i];
    }

    const c: number[] = [cin];
    // C1 = G0 + P0*C0
    c[1] = g[0] | (p[0] & c[0]);
    // C2 = G1 + P1*G0 + P1*P0*C0
    c[2] = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c[0]);
    // C3 = G2 + P2*G1 + P2*P1*G0 + P2*P1*P0*C0
    c[3] = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & c[0]);
    // C4 = G3 + P3*G2 + P3*P2*G1 + P3*P2*P1*G0 + P3*P2*P1*P0*C0
    c[4] = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1]) | (p[3] & p[2] & p[1] & g[0]) | (p[3] & p[2] & p[1] & p[0] & c[0]);

    const sum: number[] = [];
    for (let i = 0; i < 4; i++) {
      sum[i] = p[i] ^ c[i];
    }

    return {
      sum,
      cout: c[4],
      carries: c,
      generates: g,
      propagates: p
    };
  }

  // 14. 4-bit Basic ALU
  static evalALU(a: number, b: number, opcode: number, cin: number = 0) {
    // Opcode:
    // 0: ADD (A + B + Cin)
    // 1: SUB (A - B)
    // 2: AND (A & B)
    // 3: OR  (A | B)
    // 4: XOR (A ^ B)
    // 5: NOT A (~A & 0xF)
    // 6: PASS A
    // 7: PASS B
    let result = 0;
    let carry = 0;
    let overflow = 0;

    switch (opcode) {
      case 0: { // ADD
        const total = a + b + cin;
        result = total & 0xf;
        carry = total > 15 ? 1 : 0;
        // Overflow in 2's complement 4-bit (signed -8..7)
        const sA = (a >= 8) ? a - 16 : a;
        const sB = (b >= 8) ? b - 16 : b;
        const sRes = sA + sB + cin;
        overflow = (sRes < -8 || sRes > 7) ? 1 : 0;
        break;
      }
      case 1: { // SUB
        const total = a - b;
        result = total & 0xf;
        carry = a >= b ? 1 : 0; // Borrow flag / carry
        const sA = (a >= 8) ? a - 16 : a;
        const sB = (b >= 8) ? b - 16 : b;
        const sRes = sA - sB;
        overflow = (sRes < -8 || sRes > 7) ? 1 : 0;
        break;
      }
      case 2: // AND
        result = a & b;
        break;
      case 3: // OR
        result = a | b;
        break;
      case 4: // XOR
        result = a ^ b;
        break;
      case 5: // NOT
        result = (~a) & 0xf;
        break;
      case 6: // PASS A
        result = a;
        break;
      case 7: // PASS B
        result = b;
        break;
    }

    const zero = result === 0 ? 1 : 0;
    const negative = (result & 0x8) !== 0 ? 1 : 0;

    return {
      result,
      resultBits: result.toString(2).padStart(4, '0'),
      zero,
      carry,
      negative,
      overflow
    };
  }
}

