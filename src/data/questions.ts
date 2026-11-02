export interface QuizQuestion {
  id: string;
  topicId: string;
  topicName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Topic: Logic Gates
  {
    id: 'q_gate_1',
    topicId: 'logic-gates',
    topicName: 'Logic Gates',
    question: 'Which of the following gates are known as Universal Gates?',
    options: ['AND and OR', 'NAND and NOR', 'XOR and XNOR', 'NOT and AND'],
    correctIndex: 1,
    explanation: 'NAND and NOR gates are universal gates because any combinational or sequential Boolean function can be realized using only NAND or only NOR gates.'
  },
  {
    id: 'q_gate_2',
    topicId: 'logic-gates',
    topicName: 'Logic Gates',
    question: 'What is the output of an XOR gate when both inputs A and B are equal to 1?',
    options: ['1', '0', 'High Impedance (Z)', 'Indeterminate'],
    correctIndex: 1,
    explanation: 'An XOR gate outputs 1 only when inputs differ (A ≠ B). When A = 1 and B = 1, output Y = 1 ⊕ 1 = 0.'
  },
  {
    id: 'q_gate_3',
    topicId: 'logic-gates',
    topicName: 'Logic Gates',
    question: 'Which logic gate behaves as an equality comparator for two 1-bit inputs?',
    options: ['XOR', 'OR', 'XNOR', 'NAND'],
    correctIndex: 2,
    explanation: 'The XNOR gate outputs 1 when both inputs are identical (00 or 11), making it a 1-bit equality detector.'
  },

  // Topic: Number Systems
  {
    id: 'q_num_1',
    topicId: 'number-systems',
    topicName: 'Number Systems',
    question: 'What is the 8-bit 2\'s complement representation of decimal number -12?',
    options: ['11110100', '11110011', '10001100', '11110101'],
    correctIndex: 0,
    explanation: '+12 in 8-bit binary is 00001100. 1\'s complement is 11110011. Adding 1 gives 11110100.'
  },
  {
    id: 'q_num_2',
    topicId: 'number-systems',
    topicName: 'Number Systems',
    question: 'What is the hexadecimal equivalent of octal number (75)₈?',
    options: ['3D', '3B', '4F', '75'],
    correctIndex: 0,
    explanation: '(75)₈ = (111 101)₂. Regroup into 4-bit nibbles: 0011 1101₂ = (3D)₁₆.'
  },
  {
    id: 'q_num_3',
    topicId: 'number-systems',
    topicName: 'Number Systems',
    question: 'What is the range of signed integers that can be stored in an 8-bit 2\'s complement register?',
    options: ['-128 to +127', '-127 to +128', '-256 to +255', '0 to 255'],
    correctIndex: 0,
    explanation: 'For n bits, the signed 2\'s complement range is -2^(n-1) to +2^(n-1) - 1. For n = 8: -128 to +127.'
  },

  // Topic: Boolean Algebra
  {
    id: 'q_bool_1',
    topicId: 'boolean-algebra',
    topicName: 'Boolean Algebra',
    question: 'According to De Morgan\'s theorem, (A + B + C)\' is equivalent to:',
    options: ['A\' + B\' + C\'', 'A\' · B\' · C\'', '(A · B · C)\'', 'A + B\' + C'],
    correctIndex: 1,
    explanation: 'De Morgan\'s second theorem generalizes to n variables: the complement of a sum equals the product of individual complements.'
  },
  {
    id: 'q_bool_2',
    topicId: 'boolean-algebra',
    topicName: 'Boolean Algebra',
    question: 'Simplify the Boolean expression: A + A · B',
    options: ['B', 'A · B', 'A', '1'],
    correctIndex: 2,
    explanation: 'By the Absorption Law: A + A·B = A · (1 + B) = A · 1 = A.'
  },
  {
    id: 'q_bool_3',
    topicId: 'boolean-algebra',
    topicName: 'Boolean Algebra',
    question: 'What is the dual of the Boolean expression: A + B · C = (A + B)(A + C)?',
    options: [
      'A · (B + C) = A·B + A·C',
      'A\' + B\' · C\' = A\'·B\'',
      'A + B + C = A·B·C',
      '(A + B)\' = A\'·B\''
    ],
    correctIndex: 0,
    explanation: 'By the Principle of Duality, replace + with · and · with + to obtain A · (B + C) = A·B + A·C.'
  },

  // Topic: K-Maps
  {
    id: 'q_kmap_1',
    topicId: 'k-maps',
    topicName: 'K-Maps',
    question: 'Why is Gray code ordering used along the rows and columns of a Karnaugh map?',
    options: [
      'It reduces calculation time in computers',
      'Adjacent cells differ by exactly one bit',
      'It allows numbers greater than 16',
      'It eliminates the need for don\'t care conditions'
    ],
    correctIndex: 1,
    explanation: 'Gray code ensures that horizontally and vertically adjacent cells differ in only a single binary variable, enabling algebraic elimination of that variable.'
  },
  {
    id: 'q_kmap_2',
    topicId: 'k-maps',
    topicName: 'K-Maps',
    question: 'In a 4-variable K-map, a rectangular group of 8 adjacent cells eliminates how many variables?',
    options: ['1 variable', '2 variables', '3 variables', '4 variables'],
    correctIndex: 2,
    explanation: 'A group of size 2^k eliminates k variables. For size 8 = 2^3, exactly 3 variables are eliminated.'
  },

  // Topic: Adders & Subtractors
  {
    id: 'q_add_1',
    topicId: 'adders-subtractors',
    topicName: 'Adders & Subtractors',
    question: 'What is the advantage of a Look-Ahead Carry Adder (CLA) over a Ripple Carry Adder?',
    options: [
      'It uses fewer logic gates',
      'It drastically reduces carry propagation delay',
      'It does not require binary inputs',
      'It consumes zero power'
    ],
    correctIndex: 1,
    explanation: 'Ripple carry adders experience O(n) delay as carries ripple stage-by-stage. CLA generates all carries in parallel with O(1) two-gate-level delay.'
  },
  {
    id: 'q_add_2',
    topicId: 'adders-subtractors',
    topicName: 'Adders & Subtractors',
    question: 'What are the Boolean expressions for the Sum (S) and Carry (C) of a Half Adder?',
    options: [
      'S = A · B, C = A + B',
      'S = A ⊕ B, C = A · B',
      'S = A + B, C = A ⊕ B',
      'S = A\' · B, C = A ⊕ B'
    ],
    correctIndex: 1,
    explanation: 'Sum is computed by XOR: S = A ⊕ B. Carry is computed by AND: C = A · B.'
  },

  // Topic: Multiplexers & Decoders
  {
    id: 'q_mux_1',
    topicId: 'multiplexers-demultiplexers',
    topicName: 'Multiplexers & Demultiplexers',
    question: 'How many select lines are required for a 16:1 multiplexer?',
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: '2^n = 16 => n = 4 select lines.'
  },
  {
    id: 'q_mux_2',
    topicId: 'encoders-decoders',
    topicName: 'Encoders & Decoders',
    question: 'If multiple inputs are active in an 8-to-3 Priority Encoder, how is output determined?',
    options: [
      'Circuit enters high-impedance state',
      'Output corresponds to the highest-order active input',
      'Output is the logical OR of all codes',
      'Circuit raises an error flag and resets'
    ],
    correctIndex: 1,
    explanation: 'Priority encoders have internal priority logic so the binary output code matches the highest indexed input line that is currently HIGH.'
  },

  // Topic: Flip-Flops
  {
    id: 'q_ff_1',
    topicId: 'flip-flops',
    topicName: 'Flip-Flops',
    question: 'What is the next state Q(t+1) of a JK flip-flop when J = 1, K = 1, and present state Q(t) = 0?',
    options: ['0', '1', 'High Impedance', 'Undefined / Forbidden'],
    correctIndex: 1,
    explanation: 'When J=1 and K=1, the JK flip-flop toggles its state. Since current Q = 0, the next state becomes 1.'
  },
  {
    id: 'q_ff_2',
    topicId: 'flip-flops',
    topicName: 'Flip-Flops',
    question: 'Why is the input condition S = 1, R = 1 forbidden in an SR flip-flop?',
    options: [
      'It causes excessive power consumption',
      'It makes both outputs Q and Q\' equal to 0, causing a race condition on release',
      'It permanently burns the flip-flop gates',
      'It cannot be physically wired'
    ],
    correctIndex: 1,
    explanation: 'S=1, R=1 forces both outputs to 0 (or 1 depending on gate type), violating Q = NOT(Q\'). When inputs drop simultaneously to 0, unpredictable oscillation (race condition) ensues.'
  },
  {
    id: 'q_ff_3',
    topicId: 'flip-flops',
    topicName: 'Flip-Flops',
    question: 'How does a D flip-flop differ from a D latch?',
    options: [
      'A D latch is edge-triggered; a D flip-flop is level-sensitive',
      'A D flip-flop is edge-triggered; a D latch is level-sensitive',
      'D flip-flop requires no clock',
      'D latch has two data inputs'
    ],
    correctIndex: 1,
    explanation: 'Latches are transparent whenever enable is HIGH. Flip-flops sample the data input strictly on the rising or falling edge of the clock signal.'
  },

  // Topic: Counters
  {
    id: 'q_cnt_1',
    topicId: 'counters',
    topicName: 'Counters',
    question: 'How many flip-flops are needed to construct a decade (BCD / Mod-10) counter?',
    options: ['3', '4', '5', '10'],
    correctIndex: 1,
    explanation: '2^(n-1) < N ≤ 2^n. For N = 10: 2^3 = 8 < 10 ≤ 2^4 = 16. Hence, 4 flip-flops are required.'
  },
  {
    id: 'q_cnt_2',
    topicId: 'counters',
    topicName: 'Counters',
    question: 'How many unique valid states does a 4-bit Johnson (twisted ring) counter have?',
    options: ['4', '8', '16', '32'],
    correctIndex: 1,
    explanation: 'An n-bit Johnson counter cycles through 2n states. For n = 4: 2 × 4 = 8 unique states.'
  },

  // Topic: Shift Registers
  {
    id: 'q_reg_1',
    topicId: 'shift-registers',
    topicName: 'Shift Registers',
    question: 'In a 4-bit SIPO shift register, how many clock pulses are required to load 4 bits of serial data?',
    options: ['1 pulse', '4 pulses', '8 pulses', '16 pulses'],
    correctIndex: 1,
    explanation: 'Loading serial data requires 1 clock pulse per bit. For 4 bits, exactly 4 clock pulses are required.'
  },
  {
    id: 'q_reg_2',
    topicId: 'shift-registers',
    topicName: 'Shift Registers',
    question: 'What arithmetic operation is performed when binary data in a shift register is shifted left by one bit position?',
    options: [
      'Multiplication by 2',
      'Division by 2',
      'Addition of 1',
      'Subtraction of 1'
    ],
    correctIndex: 0,
    explanation: 'Shifting binary digits to the left by 1 position increases the positional weight of each bit by a factor of 2, multiplying the binary number by 2.'
  }
];

