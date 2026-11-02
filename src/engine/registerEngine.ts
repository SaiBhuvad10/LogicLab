export type ShiftRegisterType = 'SISO' | 'SIPO' | 'PISO' | 'PIPO';
export type ShiftDirection = 'LEFT' | 'RIGHT';

export interface ShiftRegisterState {
  type: ShiftRegisterType;
  bitCount: number;
  direction: ShiftDirection;
  bits: number[]; // e.g. [Q3, Q2, Q1, Q0]
  serialIn: number;
  serialOut: number;
  parallelIn: number[];
  mode: 'SHIFT' | 'LOAD';
  clockCycles: number;
  history: {
    clock: number;
    serialIn: number;
    bits: number[];
    serialOut: number;
    action: string;
  }[];
}

export class RegisterEngine {
  static getInitialState(
    type: ShiftRegisterType = 'SIPO',
    bitCount: number = 4,
    direction: ShiftDirection = 'RIGHT'
  ): ShiftRegisterState {
    const bits = new Array(bitCount).fill(0);
    return {
      type,
      bitCount,
      direction,
      bits,
      serialIn: 1,
      serialOut: 0,
      parallelIn: new Array(bitCount).fill(0),
      mode: 'SHIFT',
      clockCycles: 0,
      history: [
        {
          clock: 0,
          serialIn: 1,
          bits: [...bits],
          serialOut: 0,
          action: 'Reset / Initialization'
        }
      ]
    };
  }

  static tick(state: ShiftRegisterState): ShiftRegisterState {
    const { type, bitCount, direction, bits, serialIn, parallelIn, mode, clockCycles } = state;
    const newBits = [...bits];
    let serialOut = 0;
    let action = '';

    if (type === 'PIPO') {
      // Parallel In, Parallel Out: Loads all bits at once
      for (let i = 0; i < bitCount; i++) {
        newBits[i] = parallelIn[i];
      }
      action = `Parallel Load: [${newBits.join(', ')}]`;
    } else if (type === 'PISO' && mode === 'LOAD') {
      // Load parallel data into internal flip-flops
      for (let i = 0; i < bitCount; i++) {
        newBits[i] = parallelIn[i];
      }
      serialOut = direction === 'RIGHT' ? newBits[bitCount - 1] : newBits[0];
      action = `Parallel Load active: loaded [${newBits.join(', ')}]`;
    } else {
      // Shifting mode (SISO, SIPO, or PISO in SHIFT mode)
      if (direction === 'RIGHT') {
        // Shift right: MSB gets serialIn, LSB shifted out
        serialOut = newBits[bitCount - 1];
        for (let i = bitCount - 1; i > 0; i--) {
          newBits[i] = newBits[i - 1];
        }
        newBits[0] = serialIn;
        action = `Shift Right: Injected ${serialIn} into Q0/MSB, ejected ${serialOut}`;
      } else {
        // Shift left: LSB gets serialIn, MSB shifted out
        serialOut = newBits[0];
        for (let i = 0; i < bitCount - 1; i++) {
          newBits[i] = newBits[i + 1];
        }
        newBits[bitCount - 1] = serialIn;
        action = `Shift Left: Injected ${serialIn} into Q${bitCount - 1}, ejected ${serialOut}`;
      }
    }

    const nextClock = clockCycles + 1;
    const newHistory = [
      ...state.history.slice(-19),
      {
        clock: nextClock,
        serialIn,
        bits: [...newBits],
        serialOut,
        action
      }
    ];

    return {
      ...state,
      bits: newBits,
      serialOut,
      clockCycles: nextClock,
      history: newHistory
    };
  }
}

