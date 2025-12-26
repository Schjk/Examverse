import { Question, QuestionType, Subject, Difficulty } from '../types.ts';

export const MOCK_QUESTIONS: Question[] = [
  // PHYSICS
  {
    id: 'p1',
    text: "A particle is projected with velocity 20 m/s at an angle of 60° with the horizontal. The radius of curvature of the trajectory at the highest point is (g = 10 m/s²)",
    type: QuestionType.MCQ,
    subject: Subject.PHYSICS,
    topic: "Kinematics",
    difficulty: Difficulty.MEDIUM,
    options: ["10 m", "20 m", "30 m", "40 m"],
    correctAnswer: "0",
    solution: "At highest point, v = u cosθ. Radius of curvature R = v²/g."
  },
  {
    id: 'p2',
    text: "Two capacitors of capacitances 3µF and 6µF are charged to potentials of 2V and 5V respectively. These are then connected in parallel plates of opposite polarities connected together. The common potential is:",
    type: QuestionType.MCQ,
    subject: Subject.PHYSICS,
    topic: "Electrostatics",
    difficulty: Difficulty.HARD,
    options: ["1V", "2V", "3V", "4V"],
    correctAnswer: "2",
    solution: "Common potential V = (C1V1 - C2V2) / (C1 + C2)"
  },
  {
    id: 'p3',
    text: "Calculate the dimensional formula of Planck's constant.",
    type: QuestionType.MCQ,
    subject: Subject.PHYSICS,
    topic: "Units & Dimensions",
    difficulty: Difficulty.EASY,
    options: ["ML²T⁻¹", "MLT⁻¹", "ML²T⁻²", "MLT⁻²"],
    correctAnswer: "0",
    solution: "E = hv => h = E/v = [ML²T⁻²]/[T⁻¹] = [ML²T⁻¹]"
  },
  // CHEMISTRY
  {
    id: 'c1',
    text: "Which of the following has the highest bond order?",
    type: QuestionType.MCQ,
    subject: Subject.CHEMISTRY,
    topic: "Chemical Bonding",
    difficulty: Difficulty.MEDIUM,
    options: ["O₂", "O₂⁺", "O₂⁻", "O₂²⁻"],
    correctAnswer: "1",
    solution: "Bond order of O₂⁺ is 2.5, which is highest among given species."
  },
  {
    id: 'c2',
    text: "The oxidation state of Cr in CrO₅ is:",
    type: QuestionType.NUMERIC,
    subject: Subject.CHEMISTRY,
    topic: "Redox Reactions",
    difficulty: Difficulty.MEDIUM,
    correctAnswer: "6",
    solution: "CrO₅ has a butterfly structure with two peroxy linkages. x - 4(-1) - 2 = 0 => x = +6"
  },
  // MATHS
  {
    id: 'm1',
    text: "If z is a complex number such that |z| = 4 and arg(z) = 5π/6, then z is equal to:",
    type: QuestionType.MCQ,
    subject: Subject.MATHS,
    topic: "Complex Numbers",
    difficulty: Difficulty.MEDIUM,
    options: ["-2√3 + 2i", "2√3 + 2i", "2√3 - 2i", "-2√3 - 2i"],
    correctAnswer: "0",
    solution: "z = r(cosθ + i sinθ) = 4(cos 150° + i sin 150°) = 4(-√3/2 + i/2)"
  },
  {
    id: 'm2',
    text: "The number of integral solutions of the equation x + y + z + w = 20 where x, y, z, w ≥ -1 is:",
    type: QuestionType.NUMERIC,
    subject: Subject.MATHS,
    topic: "Permutations & Combinations",
    difficulty: Difficulty.HARD,
    correctAnswer: "2600",
    solution: "Let X = x+1, Y = y+1, etc. X+Y+Z+W = 24. Use (n+r-1)Cr-1 formula."
  }
];