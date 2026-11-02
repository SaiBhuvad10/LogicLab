# LogicLab — Digital Electronics Laboratory Simulator

A software-based, educational digital electronics laboratory designed for **Semester III Computer Engineering** students. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **React Flow (@xyflow/react)**, **Zustand**, and **Vitest**.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0+ (Tested on v22.17.0)
- **npm**: v9.0.0+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Run automated logic engine unit tests
npm test

# 4. Compile production build
npm run build
```

---

## 🏛️ Application Architecture

```
DE/
├── src/
│   ├── engine/                     # Pure TypeScript Mathematical Logic Engines
│   │   ├── gateEngine.ts           # 7 Logic gates & truth tables
│   │   ├── circuitEngine.ts        # Directed graph DAG topological sort & cycle detection
│   │   ├── truthTableEngine.ts     # 2^n state generator & circuit-to-truth-table
│   │   ├── booleanEngine.ts        # Shunting-yard expression parser & algebraic minimization
│   │   ├── kmapEngine.ts           # Torus Gray-code Karnaugh map grouping & Prime Implicants
│   │   ├── numberSystemEngine.ts   # Radix conversion steps, 1's/2's comp & binary ALU
│   │   ├── combinationalEngine.ts  # 14 adders, subtractors, MUX, DEMUX, decoders, CLA & ALU
│   │   ├── flipFlopEngine.ts       # Edge-triggered SR, JK, D, T bistable multivibrators
│   │   ├── counterEngine.ts        # Async, sync, Mod-N, Ring & Johnson counters
│   │   └── registerEngine.ts       # SISO, SIPO, PISO, PIPO bidirectional registers
│   ├── store/
│   │   ├── appStore.ts             # Theme, settings, notifications, universal search
│   │   └── circuitStore.ts         # React Flow canvas, node/wire graph state, history
│   ├── components/
│   │   ├── layout/                 # Layout, Header, Sidebar
│   │   └── circuit/                # Studio Canvas, ComponentLibrary, Inspector, SimulationPanel
│   │       └── nodes/              # GateNode, InputNode, OutputNode, ClockNode
│   ├── pages/                      # All 15 Interactive Laboratory Modules
│   │   ├── Dashboard.tsx
│   │   ├── GateSimulator.tsx
│   │   ├── CircuitDesigner.tsx
│   │   ├── TruthTable.tsx
│   │   ├── BooleanSolver.tsx
│   │   ├── KMapSolver.tsx
│   │   ├── NumberSystem.tsx
│   │   ├── CombinationalCircuits.tsx
│   │   ├── FlipFlopSimulator.tsx
│   │   ├── CounterSimulator.tsx
│   │   ├── ShiftRegisterSimulator.tsx
│   │   ├── LearningCentre.tsx
│   │   ├── Quiz.tsx
│   │   ├── SavedCircuits.tsx
│   │   └── Settings.tsx
│   ├── data/                       # Syllabus topics, question bank, preset schematics
│   ├── utils/                      # LocalStorage persistence, export/import utilities
│   ├── test/                       # Vitest test suite (37 unit tests)
│   ├── types/                      # TypeScript definitions
│   ├── App.tsx                     # React Router routes
│   └── main.tsx                    # React DOM entry
```

---

## 🛠️ The 15 Core Modules

1. **Dashboard**: Real metrics, available gates, schematics count, quiz performance, quick access cards, and getting started guide.
2. **Logic Gate Simulator**: Real-time simulation of 7 gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) with interactive switches, glowing LEDs, and active truth table highlighting.
3. **Advanced Circuit Designer**: Drag-and-drop workspace using `@xyflow/react`. Supports inputs (switches, clocks, constants), all gates, and outputs (LEDs, logic probes, displays). Computes topological signal flow, detects combinational cycles, highlights active wires green, supports undo/redo, save/load, and JSON export/import.
4. **Truth Table Generator**: 1-4 variables ($2^n$ rows), custom Boolean parser, canonical SOP ($\Sigma m$) & POS ($\Pi M$) forms, CSV export, and auto-generation directly from schematic circuits.
5. **Boolean Algebra Solver**: Expression tokenizer, law-based algebraic simplifier (Involution, Dominance, Identity, Complement, Idempotent, Absorption), and verification.
6. **Karnaugh Map (K-Map) Solver**: 2, 3, and 4-variable K-maps with Gray-code coordinate indexing, interactive cell cycling ($0 \rightarrow 1 \rightarrow X \rightarrow 0$), prime implicant grouping on torus geometry, and minimal SOP/POS outputs.
7. **Number System Converter**: Bases 2, 8, 10, 16 with step-by-step mathematical working (positional weights & repeated division), 1's/2's complement representation, and binary arithmetic (add/sub) with carry/borrow tracking.
8. **Combinational Circuits**: 14 interactive simulators: Half/Full Adder, Half/Full Subtractor, 2:1 & 4:1 MUX, 1:2 & 1:4 DEMUX, 2:4 & 3:8 Decoders, 8:3 Priority Encoder, 4-bit Digital Comparator, 4-bit Look-Ahead Carry Adder (CLA), and 4-bit ALU with Status Flags (Z, C, N, V).
9. **Flip-Flop Simulator**: Edge-triggered SR, JK, D, and T flip-flops with clock pulse generator, excitation tables, state transition log, and forbidden SR ($S=1, R=1$) metastability warning.
10. **Counter Simulator**: Ripple up/down, synchronous up/down, Mod-N with custom modulus, ring, and Johnson counters with LED indicators and sequence table.
11. **Shift Register Simulator**: SISO, SIPO, PISO, and PIPO registers with bidirectional shifting, parallel load, stage-by-stage visualizer, and step history.
12. **Learning Centre**: 12 syllabus topics covering semester curriculum with notes, definitions, formulas, truth tables, and exam practice questions.
13. **Quiz & Practice**: Topic-wise and random MCQs with textbook explanations, score tracking, local high score storage, and confetti reward.
14. **Saved Circuits**: Full LocalStorage management (open, duplicate, rename, delete, export/import JSON) preloaded with verified educational circuits.
15. **Settings**: Theme customization (Light/Dark/System), simulation tick speed, grid snapping, and local data reset.

---

## 🧪 Simulation Engine Mechanics

- **Topological DAG Ordering**: Circuit components are modeled as vertices in a directed acyclic graph. Kahn's algorithm resolves evaluation order from primary inputs to outputs.
- **Cycle Detection**: DFS 3-color algorithm (White, Gray, Black) detects combinational feedback loops and flags race condition hazards.
- **Boolean Shunting-Yard Parser**: Converts infix logic expressions to Reverse Polish Notation (RPN) with operator precedence: `NOT (!)` > `AND (*)` > `XOR (^)` = `XNOR (@)` > `OR (+)`.
- **Torus K-Map Minimization**: Wraps adjacent cells horizontally and vertically to compute maximal prime implicant groups of sizes 16, 8, 4, 2, 1, handling don't-care conditions ($X$).
- **Carry Look-Ahead Formulation**: Fast carry generation computes $G_i = A_i \cdot B_i$ and $P_i = A_i \oplus B_i$ to calculate all carries $C_{i+1}$ in 2 gate delays without ripple delay.

