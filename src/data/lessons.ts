export interface LessonTopic {
  id: string;
  number: number;
  title: string;
  summary: string;
  definitions: { term: string; definition: string }[];
  content: string[];
  formulas?: string[];
  truthTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  relatedSimulatorPath: string;
  relatedSimulatorLabel: string;
  practiceQuestions: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}

export const LESSON_TOPICS: LessonTopic[] = [
  {
    id: 'intro',
    number: 1,
    title: 'Introduction to Digital Electronics',
    summary: 'Foundations of digital vs analog signals, binary logic levels, noise margins, and TTL/CMOS voltage thresholds.',
    definitions: [
      {
        term: 'Digital Signal',
        definition: 'A signal representing values as a sequence of discrete numbers, typically binary (HIGH / LOW or 1 / 0).'
      },
      {
        term: 'Noise Margin',
        definition: 'The maximum allowable spurious voltage that can be superimposed on a digital signal without causing incorrect logic level interpretation.'
      },
      {
        term: 'Propagation Delay (t_pd)',
        definition: 'The time delay between the application of an input signal and the resulting change at the output.'
      }
    ],
    content: [
      'Digital electronics processes discrete electrical voltages (logic HIGH: +5V TTL or +3.3V CMOS, logic LOW: 0V GND).',
      'Unlike analog circuits which suffer degradation from noise accumulation, digital circuits regenerate clean signals at each logic stage.',
      'Binary logic forms the mathematical backbone of modern computing architectures, ALU design, memory cells, and microprocessors.'
    ],
    formulas: [
      'Noise Margin High: NM_H = V_OH(min) - V_IH(min)',
      'Noise Margin Low: NM_L = V_IL(max) - V_OL(max)'
    ],
    relatedSimulatorPath: '/gates',
    relatedSimulatorLabel: 'Open Logic Gate Simulator',
    practiceQuestions: [
      {
        question: 'Why are digital circuits preferred over analog circuits in computing systems?',
        answer: 'Greater noise immunity, ease of storage, error detection/correction capability, and programmability.',
        explanation: 'Digital signals only recognize discrete quantization levels (0 and 1), rejecting minor analog noise fluctuations.'
      }
    ]
  },
  {
    id: 'number-systems',
    number: 2,
    title: 'Number Systems & Radix Arithmetic',
    summary: 'Positional number representation in Binary (base 2), Octal (base 8), Decimal (base 10), and Hexadecimal (base 16).',
    definitions: [
      {
        term: 'Radix (Base)',
        definition: 'The total number of unique symbols or digits used to represent numbers in a positional numeral system.'
      },
      {
        term: '2\'s Complement',
        definition: 'The binary representation obtained by adding 1 to the 1\'s complement (inverted bits) of a number. Enables subtraction via addition.'
      },
      {
        term: 'Floating Point Mantissa & Exponent',
        definition: 'Representation used for real fractional values following IEEE 754 standard.'
      }
    ],
    content: [
      'Conversion from base r to base 10 uses positional weighting: N = Σ (d_i × r^i).',
      'Conversion from decimal to base r utilizes the repeated division-by-r algorithm with remainders collected in reverse order (bottom-to-top).',
      'In 2\'s complement arithmetic, an n-bit register represents signed integers in range: -2^(n-1) to +(2^(n-1) - 1).'
    ],
    formulas: [
      'Signed Range (n bits): -2^(n-1) ≤ N ≤ 2^(n-1) - 1',
      '2\'s Complement: ~N + 1'
    ],
    relatedSimulatorPath: '/number-system',
    relatedSimulatorLabel: 'Open Number System Converter',
    practiceQuestions: [
      {
        question: 'What is the 8-bit 2\'s complement of decimal -5?',
        answer: '11111011',
        explanation: 'Positive 5 is 00000101. 1\'s complement is 11111010. Add 1 gives 11111011.'
      }
    ]
  },
  {
    id: 'logic-gates',
    number: 3,
    title: 'Logic Gates & Universal Gates',
    summary: 'Basic gates (AND, OR, NOT), Universal gates (NAND, NOR), and Special gates (XOR, XNOR).',
    definitions: [
      {
        term: 'Universal Gate',
        definition: 'A logic gate that can implement any Boolean function without using any other type of gate (NAND and NOR).'
      },
      {
        term: 'Truth Table',
        definition: 'A tabular representation showing all possible combinations of inputs and the resulting functional outputs.'
      }
    ],
    content: [
      'AND produces 1 only when all inputs are 1. OR produces 1 when at least one input is 1.',
      'NOT inverts binary logic level.',
      'NAND and NOR are functionally complete. A NOT gate can be built from a NAND by tying both inputs together: A NAND A = A\'.',
      'XOR acts as an inequality detector / parity generator. XNOR acts as an equality comparator.'
    ],
    relatedSimulatorPath: '/gates',
    relatedSimulatorLabel: 'Open Logic Gate Simulator',
    practiceQuestions: [
      {
        question: 'How many 2-input NAND gates are needed to construct a 2-input XOR gate?',
        answer: '4 NAND gates',
        explanation: 'Y = A ⊕ B = (A NAND (A NAND B)) NAND (B NAND (A NAND B)).'
      }
    ]
  },
  {
    id: 'boolean-algebra',
    number: 4,
    title: 'Boolean Algebra & De Morgan\'s Theorems',
    summary: 'Axioms, dualities, idempotent, absorption, and De Morgan\'s fundamental theorems.',
    definitions: [
      {
        term: 'De Morgan\'s First Theorem',
        definition: '(A · B)\' = A\' + B\'. The complement of a product is equal to the sum of the complements.'
      },
      {
        term: 'De Morgan\'s Second Theorem',
        definition: '(A + B)\' = A\' · B\'. The complement of a sum is equal to the product of the complements.'
      },
      {
        term: 'Duality Principle',
        definition: 'Any Boolean identity remains valid if AND and OR operators are interchanged, and 0 and 1 are interchanged.'
      }
    ],
    content: [
      'Boolean laws allow simplification of logic expressions to minimize circuit gate count and propagation delay.',
      'Canonical forms: Sum-of-Products (SOP) where each product term is a minterm, and Product-of-Sums (POS) where each sum term is a maxterm.'
    ],
    formulas: [
      'Absorption 1: A + A·B = A',
      'Absorption 2: A · (A + B) = A',
      'Consensus: A·B + A\'·C + B·C = A·B + A\'·C'
    ],
    relatedSimulatorPath: '/boolean-solver',
    relatedSimulatorLabel: 'Open Boolean Algebra Solver',
    practiceQuestions: [
      {
        question: 'Simplify the expression: A + A\'·B',
        answer: 'A + B',
        explanation: 'By Distributive Law: (A + A\')(A + B) = 1 · (A + B) = A + B.'
      }
    ]
  },
  {
    id: 'k-maps',
    number: 5,
    title: 'Karnaugh Maps (K-Maps)',
    summary: 'Systematic graphical method for Boolean expression minimization up to 4 variables.',
    definitions: [
      {
        term: 'Gray Code Ordering',
        definition: 'Binary ordering where adjacent codes differ in only one single bit position (00, 01, 11, 10).'
      },
      {
        term: 'Prime Implicant (PI)',
        definition: 'A rectangular group of 2^k adjacent 1s that cannot be combined with another group to form a larger group.'
      },
      {
        term: 'Essential Prime Implicant (EPI)',
        definition: 'A prime implicant containing at least one minterm (1) that is not covered by any other prime implicant.'
      }
    ],
    content: [
      'Cells in a K-map represent minterms arranged on a toroidal grid (wrapping top-to-bottom and left-to-right).',
      'Groups must always be of sizes 1, 2, 4, 8, 16 (powers of 2).',
      'Don\'t care conditions (X) can be included inside a group if they help enlarge the group to a higher power of 2.'
    ],
    relatedSimulatorPath: '/kmap-solver',
    relatedSimulatorLabel: 'Open K-Map Solver',
    practiceQuestions: [
      {
        question: 'What variable is eliminated when grouping minterms m0(0000) and m2(0010) in a 4-variable K-map (A,B,C,D)?',
        answer: 'Variable C',
        explanation: 'm0 = A\'B\'C\'D\', m2 = A\'B\'CD\'. Variable C changes from 0 to 1 and is eliminated. Group term is A\'B\'D\'.'
      }
    ]
  },
  {
    id: 'combinational-logic',
    number: 6,
    title: 'Combinational Logic Design',
    summary: 'Design methodology for memoryless circuits whose outputs depend solely on present inputs.',
    definitions: [
      {
        term: 'Combinational Circuit',
        definition: 'A circuit composed of interconnected logic gates where the output at any instant depends only on the present input values.'
      },
      {
        term: 'Hazards & Glitches',
        definition: 'Unwanted transient switching spikes at output caused by unequal propagation delays along differing internal paths.'
      }
    ],
    content: [
      'Steps to design: Problem specification -> Truth table formulation -> K-map minimization -> Logic diagram generation.',
      'Applications include arithmetic units, code converters, bus routers, and address decoders.'
    ],
    relatedSimulatorPath: '/combinational',
    relatedSimulatorLabel: 'Open Combinational Circuits',
    practiceQuestions: [
      {
        question: 'Does a combinational circuit have memory or clock signals?',
        answer: 'No',
        explanation: 'Combinational circuits are purely memoryless; sequential circuits require memory and clocks.'
      }
    ]
  },
  {
    id: 'adders-subtractors',
    number: 7,
    title: 'Adders & Subtractors',
    summary: 'Binary arithmetic units: Half Adder, Full Adder, Subtractors, and Look-Ahead Carry Adders.',
    definitions: [
      {
        term: 'Half Adder',
        definition: 'Adds two 1-bit binary inputs: Sum = A ⊕ B, Carry = A · B.'
      },
      {
        term: 'Full Adder',
        definition: 'Adds three 1-bit inputs (A, B, Cin): Sum = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B).'
      },
      {
        term: 'Look-Ahead Carry Adder (CLA)',
        definition: 'Fast adder that computes carries in parallel using Generate (G = A·B) and Propagate (P = A⊕B) signals.'
      }
    ],
    content: [
      'Ripple Carry Adders suffer from O(n) delay because carry must ripple through all stages.',
      'Look-Ahead Carry Adders eliminate ripple delay by calculating all carries simultaneously with two gate levels of delay.'
    ],
    formulas: [
      'Half Adder: S = A ⊕ B, C = A·B',
      'Full Adder: S = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B)',
      'CLA Carry: C_(i+1) = G_i + P_i · C_i'
    ],
    relatedSimulatorPath: '/combinational',
    relatedSimulatorLabel: 'Open Adders & Subtractors',
    practiceQuestions: [
      {
        question: 'How many Half Adders and OR gates are needed to construct one Full Adder?',
        answer: 'Two Half Adders and one OR gate',
        explanation: 'HA1 adds A and B. HA2 adds HA1.Sum with Cin. OR gate combines both carries.'
      }
    ]
  },
  {
    id: 'multiplexers-demultiplexers',
    number: 8,
    title: 'Multiplexers & Demultiplexers',
    summary: 'Data routing elements: Multiplexers (many-to-one data selectors) and Demultiplexers (one-to-many data distributors).',
    definitions: [
      {
        term: 'Multiplexer (MUX)',
        definition: 'A circuit that selects binary information from one of 2^n input data lines and directs it to a single output line based on n select lines.'
      },
      {
        term: 'Demultiplexer (DEMUX)',
        definition: 'A circuit that takes a single input data line and distributes it to one of 2^n output lines based on n select lines.'
      }
    ],
    content: [
      'A 2^n-to-1 MUX can be used as a universal Boolean function generator for any n-variable function without extra gates.',
      'Demultiplexers can also operate as binary decoders with active-high or active-low enable inputs.'
    ],
    formulas: [
      '2:1 MUX: Y = S\'·D0 + S·D1',
      '4:1 MUX: Y = S1\'S0\'D0 + S1\'S0D1 + S1S0\'D2 + S1S0D3'
    ],
    relatedSimulatorPath: '/combinational',
    relatedSimulatorLabel: 'Open MUX & DEMUX Simulator',
    practiceQuestions: [
      {
        question: 'How many select lines does an 8-to-1 multiplexer require?',
        answer: '3 select lines',
        explanation: '2^n = 8 => n = 3.'
      }
    ]
  },
  {
    id: 'encoders-decoders',
    number: 9,
    title: 'Encoders & Decoders',
    summary: 'Code translators: 2-to-4 & 3-to-8 Decoders, Priority Encoders, and BCD-to-7-segment decoders.',
    definitions: [
      {
        term: 'Decoder',
        definition: 'A combinational circuit that converts binary information from n input lines to a maximum of 2^n unique output lines.'
      },
      {
        term: 'Priority Encoder',
        definition: 'An encoder that establishes input priority so that if multiple inputs are active simultaneously, the output reflects the highest-order input.'
      }
    ],
    content: [
      'Decoders are essential for memory address decoding in computer architecture (e.g. chip select CS logic).',
      'Encoders perform reverse decoding, converting activated physical keys/switches to binary codes.'
    ],
    relatedSimulatorPath: '/combinational',
    relatedSimulatorLabel: 'Open Decoders & Encoders',
    practiceQuestions: [
      {
        question: 'What is the purpose of the Enable (EN) input on a decoder?',
        answer: 'Controls whether the decoder is active. When disabled, all outputs remain inactive (0 or 1 depending on active level).',
        explanation: 'Enable allows cascading smaller decoders into larger decoding networks (e.g. two 3:8 decoders to make a 4:16 decoder).'
      }
    ]
  },
  {
    id: 'flip-flops',
    number: 10,
    title: 'Flip-Flops & Latches',
    summary: 'Bistable multivibrators: Set-Reset (SR), JK, Data (D), and Toggle (T) flip-flops with edge-triggering.',
    definitions: [
      {
        term: 'Latch vs Flip-Flop',
        definition: 'A latch is level-sensitive (transparent when enabled); a flip-flop is edge-triggered (samples inputs strictly on clock rising/falling edge).'
      },
      {
        term: 'Metastability',
        definition: 'An unstable intermediate voltage state caused by violating setup and hold times on flip-flop inputs.'
      },
      {
        term: 'Race-Around Condition',
        definition: 'In level-triggered JK latches when J=K=1 and pulse width > propagation delay, output toggles uncontrollably. Solved by edge-triggering or Master-Slave setup.'
      }
    ],
    content: [
      'SR flip-flop has forbidden input S=1, R=1 which breaks Q = NOT(Q\').',
      'JK flip-flop fixes the SR invalid state by toggling when J=1, K=1.',
      'D flip-flop is the primary building block for computer registers and DRAM/SRAM caches.',
      'T flip-flop divides the input clock frequency by two, making it ideal for frequency dividers and counters.'
    ],
    formulas: [
      'JK Characteristic: Q(t+1) = J·Q\' + K\'·Q',
      'D Characteristic: Q(t+1) = D',
      'T Characteristic: Q(t+1) = T ⊕ Q'
    ],
    relatedSimulatorPath: '/flip-flop',
    relatedSimulatorLabel: 'Open Flip-Flop Simulator',
    practiceQuestions: [
      {
        question: 'How is a D flip-flop constructed using a JK flip-flop?',
        answer: 'Connect D directly to J, and connect D\' (via NOT gate) to K.',
        explanation: 'When D=1, J=1, K=0 (Set). When D=0, J=0, K=1 (Reset).'
      }
    ]
  },
  {
    id: 'counters',
    number: 11,
    title: 'Counters (Synchronous & Asynchronous)',
    summary: 'Sequential circuits that cycle through a predetermined sequence of binary states upon clock pulses.',
    definitions: [
      {
        term: 'Asynchronous (Ripple) Counter',
        definition: 'A counter where clock triggers only the first flip-flop; each subsequent flip-flop is clocked by the output of the preceding stage.'
      },
      {
        term: 'Synchronous Counter',
        definition: 'A counter where all flip-flops share a common clock line and trigger simultaneously, eliminating cumulative ripple delay.'
      },
      {
        term: 'Modulus (MOD) of Counter',
        definition: 'The total number of unique states through which the counter cycles before resetting to its initial state.'
      }
    ],
    content: [
      'A Mod-N counter constructed with n flip-flops requires 2^(n-1) < N ≤ 2^n.',
      'Mod-10 (Decade / BCD) counter counts from 0000 (0) to 1001 (9) and resets on 1010 using a NAND gate on Q3 and Q1.',
      'Ring counters have MOD = n with 1 circulating bit.',
      'Johnson (twisted ring) counters have MOD = 2n.'
    ],
    relatedSimulatorPath: '/counter',
    relatedSimulatorLabel: 'Open Counter Simulator',
    practiceQuestions: [
      {
        question: 'How many flip-flops are needed to design a MOD-12 counter?',
        answer: '4 flip-flops',
        explanation: '2^3 = 8 < 12 ≤ 2^4 = 16. Hence, 4 flip-flops are required.'
      }
    ]
  },
  {
    id: 'shift-registers',
    number: 12,
    title: 'Shift Registers & Applications',
    summary: 'Cascaded flip-flops for serial/parallel data storage, shifting, and serial-to-parallel conversion.',
    definitions: [
      {
        term: 'SISO',
        definition: 'Serial-In Serial-Out: Data shifted in 1 bit per clock pulse, shifted out 1 bit per pulse. Takes n pulses to load and n to read.'
      },
      {
        term: 'SIPO',
        definition: 'Serial-In Parallel-Out: Takes n pulses to load serially, all n bits read simultaneously in 1 cycle.'
      },
      {
        term: 'Universal Shift Register',
        definition: 'A versatile register capable of serial/parallel input, serial/parallel output, bidirectional shift (left/right), and hold.'
      }
    ],
    content: [
      'Used extensively in communication protocols (UART, SPI, USB) to convert parallel system bus data to serial transmission cables.',
      'Multiplication and division by 2: Shifting binary bits left by 1 multiplies by 2; shifting right divides by 2.'
    ],
    relatedSimulatorPath: '/shift-register',
    relatedSimulatorLabel: 'Open Shift Register Simulator',
    practiceQuestions: [
      {
        question: 'How many clock pulses are required to transfer 4-bit data into a SISO register and retrieve it completely?',
        answer: '4 clock pulses to load + 3 (or 4) clock pulses to retrieve = 8 pulses total for fresh read.',
        explanation: 'Each shift moves data by one flip-flop position.'
      }
    ]
  }
];

