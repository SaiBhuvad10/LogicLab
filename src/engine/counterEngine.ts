export type CounterType =
  | 'ASYNC_UP'
  | 'ASYNC_DOWN'
  | 'SYNC_UP'
  | 'SYNC_DOWN'
  | 'MOD_N'
  | 'RING'
  | 'JOHNSON';

export interface CounterState {
  type: CounterType;
  bitCount: number;
  modN: number;
  currentValue: number;
  binaryBits: number[];
  clockCycles: number;
  history: {
    clock: number;
    value: number;
    binary: string;
    stateName: string;
  }[];
}

export class CounterEngine {
  /**
   * Initializes counter state.
   */
  static getInitialState(type: CounterType, bitCount: number = 4, modN: number = 10): CounterState {
    let initialVal = 0;
    if (type === 'RING') {
      // Ring counter starts with 1 in MSB or LSB: e.g. 1000 (val = 1 << (bitCount - 1))
      initialVal = 1 << (bitCount - 1);
    } else if (type === 'ASYNC_DOWN' || type === 'SYNC_DOWN') {
      initialVal = (1 << bitCount) - 1; // start from max
    }

    const bits = this.valToBits(initialVal, bitCount);
    return {
      type,
      bitCount,
      modN,
      currentValue: initialVal,
      binaryBits: bits,
      clockCycles: 0,
      history: [
        {
          clock: 0,
          value: initialVal,
          binary: bits.join(''),
          stateName: 'Initial State'
        }
      ]
    };
  }

  static valToBits(val: number, bitCount: number): number[] {
    const bits: number[] = [];
    for (let i = bitCount - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
    return bits;
  }

  /**
   * Advances counter by one clock pulse.
   */
  static tick(state: CounterState): CounterState {
    const { type, bitCount, modN, currentValue, clockCycles } = state;
    const maxVal = (1 << bitCount) - 1;
    let nextVal = currentValue;

    switch (type) {
      case 'ASYNC_UP':
      case 'SYNC_UP':
        nextVal = (currentValue + 1) & maxVal;
        break;

      case 'ASYNC_DOWN':
      case 'SYNC_DOWN':
        nextVal = currentValue === 0 ? maxVal : currentValue - 1;
        break;

      case 'MOD_N':
        nextVal = (currentValue + 1) % modN;
        break;

      case 'RING': {
        // Circulate right: e.g. 1000 -> 0100 -> 0010 -> 0001 -> 1000
        const lsb = currentValue & 1;
        nextVal = (currentValue >> 1) | (lsb << (bitCount - 1));
        if (nextVal === 0) nextVal = 1 << (bitCount - 1);
        break;
      }

      case 'JOHNSON': {
        // Shift right, insert inverted LSB into MSB
        const lsb = currentValue & 1;
        const invertedLsb = lsb === 0 ? 1 : 0;
        nextVal = ((currentValue >> 1) & ((1 << (bitCount - 1)) - 1)) | (invertedLsb << (bitCount - 1));
        break;
      }
    }

    const bits = this.valToBits(nextVal, bitCount);
    const nextClock = clockCycles + 1;

    const newHistory = [
      ...state.history.slice(-19), // keep last 20 entries
      {
        clock: nextClock,
        value: nextVal,
        binary: bits.join(''),
        stateName: `Clock Pulse #${nextClock}`
      }
    ];

    return {
      ...state,
      currentValue: nextVal,
      binaryBits: bits,
      clockCycles: nextClock,
      history: newHistory
    };
  }

  /**
   * Generates theoretical full state sequence for documentation and truth table.
   */
  static getSequence(type: CounterType, bitCount: number = 4, modN: number = 10): { step: number; binary: string; decimal: number }[] {
    let dummy = this.getInitialState(type, bitCount, modN);
    const totalSteps =
      type === 'RING'
        ? bitCount
        : type === 'JOHNSON'
        ? bitCount * 2
        : type === 'MOD_N'
        ? modN
        : 1 << bitCount;

    const seq: { step: number; binary: string; decimal: number }[] = [
      { step: 0, binary: dummy.binaryBits.join(''), decimal: dummy.currentValue }
    ];

    for (let i = 1; i < totalSteps; i++) {
      dummy = this.tick(dummy);
      seq.push({
        step: i,
        binary: dummy.binaryBits.join(''),
        decimal: dummy.currentValue
      });
    }

    return seq;
  }
}

