import type { DiagnosticQuestion } from '../types/debt';

export const DIAGNOSTIC_TEST_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q-1',
    conceptId: 'db-fd',
    conceptName: 'Functional Dependency',
    questionText: 'Given relation R(A, B, C) with functional dependencies {A -> B, B -> C}, what is the attribute closure {A}+?',
    type: 'Foundational Prerequisite',
    options: [
      { id: 'opt-a', text: '{A}', isCorrect: false, diagnosticInsight: 'Missed transitive closure B -> C.', targetedConceptId: 'db-fd' },
      { id: 'opt-b', text: '{A, B}', isCorrect: false, diagnosticInsight: 'Failed to apply Armstrong transitivity rule.', targetedConceptId: 'db-fd' },
      { id: 'opt-c', text: '{A, B, C}', isCorrect: true, diagnosticInsight: 'Correct! Attribute A uniquely determines all attributes in R.', targetedConceptId: 'db-fd' },
      { id: 'opt-d', text: '{B, C}', isCorrect: false, diagnosticInsight: 'Omitted starting attribute A in closure computation.', targetedConceptId: 'db-fd' },
    ],
    explanation: 'Starting with {A}, A -> B adds B ({A,B}), and B -> C adds C, yielding {A,B,C}.',
  },
  {
    id: 'q-2',
    conceptId: 'db-keys',
    conceptName: 'Candidate Keys',
    questionText: 'If {A}+ = {A, B, C, D} for relation R(A, B, C, D), which statement is correct regarding attribute set A?',
    type: 'Conceptual Application',
    options: [
      { id: 'opt-a', text: 'A is a Candidate Key for R.', isCorrect: true, diagnosticInsight: 'Correct! Minimal attribute set whose closure yields all relation attributes.', targetedConceptId: 'db-keys' },
      { id: 'opt-b', text: 'A is a non-prime attribute.', isCorrect: false, diagnosticInsight: 'Incorrect. Key attributes are prime attributes.', targetedConceptId: 'db-keys' },
      { id: 'opt-c', text: 'A causes transitive dependency.', isCorrect: false, diagnosticInsight: 'Incorrect. Candidate keys define table primary identification.', targetedConceptId: 'db-keys' },
      { id: 'opt-d', text: 'R is not in 1NF.', isCorrect: false, diagnosticInsight: 'Irrelevant to candidate key definition.', targetedConceptId: 'db-keys' },
    ],
    explanation: 'A candidate key is a minimal superkey whose closure contains all attributes of the relation.',
  },
  {
    id: 'q-3',
    conceptId: 'db-norm',
    conceptName: 'Normalization 2NF',
    questionText: 'A relation R is in 2NF if and only if it is in 1NF and no non-prime attribute is dependant on:',
    type: 'Foundational Prerequisite',
    options: [
      { id: 'opt-a', text: 'Any prime attribute.', isCorrect: false, diagnosticInsight: 'Confused with 3NF transitive dependency rules.', targetedConceptId: 'db-norm' },
      { id: 'opt-b', text: 'Any proper subset of any candidate key (Partial Dependency).', isCorrect: true, diagnosticInsight: 'Correct! 2NF eliminates partial dependencies on composite keys.', targetedConceptId: 'db-norm' },
      { id: 'opt-c', text: 'A foreign key.', isCorrect: false, diagnosticInsight: 'Foreign keys maintain referential integrity, not 2NF.', targetedConceptId: 'db-norm' },
      { id: 'opt-d', text: 'A non-key attribute.', isCorrect: false, diagnosticInsight: 'This defines 3NF transitive dependency.', targetedConceptId: 'db-norm' },
    ],
    explanation: '2NF requires eliminating partial dependencies where a non-prime attribute depends on a proper subset of a composite candidate key.',
  },
  {
    id: 'q-4',
    conceptId: 'cs-arrays',
    conceptName: 'Arrays Memory Allocation',
    questionText: 'In a 0-indexed array stored starting at memory address 0x1000 with 4-byte integers, what is the memory address of index 3?',
    type: 'Foundational Prerequisite',
    options: [
      { id: 'opt-a', text: '0x1003', isCorrect: false, diagnosticInsight: 'Confused index value with byte offset.', targetedConceptId: 'cs-arrays' },
      { id: 'opt-b', text: '0x100C (0x1000 + 3 * 4)', isCorrect: true, diagnosticInsight: 'Correct! Address = Base + (Index * ElementSize).', targetedConceptId: 'cs-arrays' },
      { id: 'opt-c', text: '0x1012', isCorrect: false, diagnosticInsight: 'Math error in 3 * 4 multiplication.', targetedConceptId: 'cs-arrays' },
      { id: 'opt-d', text: '0x1004', isCorrect: false, diagnosticInsight: 'Off-by-one index address error.', targetedConceptId: 'cs-arrays' },
    ],
    explanation: 'Address(arr[i]) = BaseAddress + (i * sizeOfElement) = 0x1000 + (3 * 4) = 0x1000 + 12 = 0x100C.',
  },
];

export const assessmentService = {
  getDiagnosticQuestions: (): DiagnosticQuestion[] => {
    return DIAGNOSTIC_TEST_QUESTIONS;
  },
  evaluateAnswers: (userAnswers: Record<string, string>) => {
    let score = 0;
    const total = DIAGNOSTIC_TEST_QUESTIONS.length;
    const gaps: string[] = [];

    DIAGNOSTIC_TEST_QUESTIONS.forEach((q) => {
      const chosenOptId = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (chosenOptId && correctOpt && chosenOptId === correctOpt.id) {
        score += 1;
      } else {
        if (!gaps.includes(q.conceptName)) gaps.push(q.conceptName);
      }
    });

    const percentage = Math.round((score / total) * 100);
    return {
      score,
      total,
      percentage,
      gaps,
    };
  },
};
