import type { RemediationModule } from '../types/debt';

export const REMEDIATION_MODULES: RemediationModule[] = [
  {
    id: 'rem-math-101',
    targetConceptId: 'math-302',
    targetConceptName: 'Integration by Substitution',
    missingPrerequisiteId: 'math-101',
    missingPrerequisiteName: 'Algebraic Factoring & Pattern Recognition',
    title: '15-Min Bridge: Unlocking Integration through Factoring Fluency',
    estimatedMinutes: 15,
    type: 'Visual Bridge',
    status: 'In Progress',
    description: 'Bridges the gap between basic polynomial factoring and recognizing inner-function derivatives during calculus integration.',
    keyTakeaway: 'Substitution is simply reversing the chain rule. If you can factor (x² + 5) from its derivative 2x, u-substitution becomes instant.',
    steps: [
      {
        stepNumber: 1,
        heading: 'Visualizing the Inner Function',
        content: 'When looking at ∫ 2x (x² + 5)⁴ dx, do not view this as a single complex expression. Look for the "Nested Box": g(x) = x² + 5 is inside the 4th power.',
        visualSnippet: 'Outer Container: ( [...] )⁴  |  Inner Core: [ x² + 5 ]',
      },
      {
        stepNumber: 2,
        heading: 'Checking for the Derivative Guard',
        content: 'Notice the term outside: 2x. Take the derivative of your Inner Core: d/dx(x² + 5) = 2x. It matches the outer term exactly!',
        codeOrFormula: 'g(x) = x² + 5  =>  g\'(x) = 2x dx',
      },
      {
        stepNumber: 3,
        heading: 'The 3-Step Substitution Protocol',
        content: '1. Set u = inner core.\n2. Write du = derivative * dx.\n3. Rewrite integral purely in terms of u: ∫ u⁴ du = u⁵ / 5 + C.',
        codeOrFormula: '∫ u⁴ du = (x² + 5)⁵ / 5 + C',
      },
    ],
  },
  {
    id: 'rem-math-102',
    targetConceptId: 'math-203',
    targetConceptName: 'Chain Rule',
    missingPrerequisiteId: 'math-102',
    missingPrerequisiteName: 'Function Composition Notation',
    title: 'Function Unwrapping: Mastering f(g(x)) Composition',
    estimatedMinutes: 12,
    type: 'Concept Reframing',
    status: 'Not Started',
    description: 'Reframes composition as nesting Russian dolls so students stop missing inner derivatives.',
    keyTakeaway: 'Differentiate the outside holding the inside constant, then multiply by derivative of inside.',
    steps: [
      {
        stepNumber: 1,
        heading: 'Russian Doll Decomposition',
        content: 'Identify outer function f() and inner function g().',
      },
    ],
  },
];
