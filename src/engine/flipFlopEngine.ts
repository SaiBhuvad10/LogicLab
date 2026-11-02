export type FlipFlopType = 'SR' | 'JK' | 'D' | 'T';

export interface FlipFlopState {
  type: FlipFlopType;
  q: number;
  qBar: number;
  isInvalid: boolean;
  statusMessage: string;
  history: {
    step: number;
    inputs: Record<string, number>;
    q: number;
    qBar: number;
    action: string;
  }[];
}

export class FlipFlopEngine {
  /**
   * Calculates the next state on a rising clock edge.
   */
  static transition(
    type: FlipFlopType,
    inputs: { s?: number; r?: number; j?: number; k?: number; d?: number; t?: number },
    currentQ: number
  ): {
    nextQ: number;
    nextQBar: number;
    isInvalid: boolean;
    action: string;
    explanation: string;
  } {
    switch (type) {
      case 'SR': {
        const s = inputs.s ?? 0;
        const r = inputs.r ?? 0;
        if (s === 0 && r === 0) {
          return {
            nextQ: currentQ,
            nextQBar: currentQ === 1 ? 0 : 1,
            isInvalid: false,
            action: 'No Change (Hold/Memory)',
            explanation: 'S=0, R=0: Both latch inputs are inactive. Circuit maintains its current state.'
          };
        } else if (s === 0 && r === 1) {
          return {
            nextQ: 0,
            nextQBar: 1,
            isInvalid: false,
            action: 'Reset',
            explanation: 'S=0, R=1: Reset input active. Q becomes 0, Q\' becomes 1.'
          };
        } else if (s === 1 && r === 0) {
          return {
            nextQ: 1,
            nextQBar: 0,
            isInvalid: false,
            action: 'Set',
            explanation: 'S=1, R=0: Set input active. Q becomes 1, Q\' becomes 0.'
          };
        } else {
          // S=1, R=1: Forbidden condition
          return {
            nextQ: 0,
            nextQBar: 0,
            isInvalid: true,
            action: 'INVALID / FORBIDDEN (Race Condition)',
            explanation: 'S=1, R=1 is forbidden in an SR flip-flop. Both outputs try to become 0 simultaneously, violating Q = NOT(Q\'). When inputs drop to 0, unpredictable oscillation (metastability) occurs.'
          };
        }
      }

      case 'JK': {
        const j = inputs.j ?? 0;
        const k = inputs.k ?? 0;
        if (j === 0 && k === 0) {
          return {
            nextQ: currentQ,
            nextQBar: currentQ === 1 ? 0 : 1,
            isInvalid: false,
            action: 'No Change (Hold)',
            explanation: 'J=0, K=0: Flip-flop holds its previous state.'
          };
        } else if (j === 0 && k === 1) {
          return {
            nextQ: 0,
            nextQBar: 1,
            isInvalid: false,
            action: 'Reset',
            explanation: 'J=0, K=1: Clear condition. Q becomes 0.'
          };
        } else if (j === 1 && k === 0) {
          return {
            nextQ: 1,
            nextQBar: 0,
            isInvalid: false,
            action: 'Set',
            explanation: 'J=1, K=0: Set condition. Q becomes 1.'
          };
        } else {
          const nextQ = currentQ === 1 ? 0 : 1;
          return {
            nextQ,
            nextQBar: currentQ,
            isInvalid: false,
            action: 'Toggle',
            explanation: 'J=1, K=1: Toggles state (inverts current Q). Resolves the forbidden state of the SR flip-flop.'
          };
        }
      }

      case 'D': {
        const d = inputs.d ?? 0;
        return {
          nextQ: d,
          nextQBar: d === 1 ? 0 : 1,
          isInvalid: false,
          action: d === 1 ? 'Set (D=1)' : 'Reset (D=0)',
          explanation: `D=${d}: The Data flip-flop samples D on the clock edge and stores it until the next clock cycle.`
        };
      }

      case 'T': {
        const t = inputs.t ?? 0;
        const nextQ = t === 1 ? (currentQ === 1 ? 0 : 1) : currentQ;
        return {
          nextQ,
          nextQBar: nextQ === 1 ? 0 : 1,
          isInvalid: false,
          action: t === 1 ? 'Toggle' : 'No Change',
          explanation: t === 1 ? 'T=1: Toggle input active; state is inverted.' : 'T=0: Toggle inactive; state is preserved.'
        };
      }
    }
  }

  static getCharacteristics(type: FlipFlopType) {
    switch (type) {
      case 'SR':
        return {
          name: 'SR (Set-Reset) Flip-Flop',
          equation: 'Q(t+1) = S + R\'Q (with SR = 0)',
          table: [
            { s: 0, r: 0, qNext: 'Q(t)', action: 'No Change' },
            { s: 0, r: 1, qNext: '0', action: 'Reset' },
            { s: 1, r: 0, qNext: '1', action: 'Set' },
            { s: 1, r: 1, qNext: 'Indeterminate', action: 'Forbidden' }
          ]
        };
      case 'JK':
        return {
          name: 'JK Flip-Flop',
          equation: 'Q(t+1) = J·Q\' + K\'·Q',
          table: [
            { j: 0, k: 0, qNext: 'Q(t)', action: 'No Change' },
            { j: 0, k: 1, qNext: '0', action: 'Reset' },
            { j: 1, k: 0, qNext: '1', action: 'Set' },
            { j: 1, k: 1, qNext: 'Q\'(t)', action: 'Toggle' }
          ]
        };
      case 'D':
        return {
          name: 'D (Data / Delay) Flip-Flop',
          equation: 'Q(t+1) = D',
          table: [
            { d: 0, qNext: '0', action: 'Reset' },
            { d: 1, qNext: '1', action: 'Set' }
          ]
        };
      case 'T':
        return {
          name: 'T (Toggle) Flip-Flop',
          equation: 'Q(t+1) = T ⊕ Q = T·Q\' + T\'·Q',
          table: [
            { t: 0, qNext: 'Q(t)', action: 'Hold' },
            { t: 1, qNext: 'Q\'(t)', action: 'Toggle' }
          ]
        };
    }
  }
}

