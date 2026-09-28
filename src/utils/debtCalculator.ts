import type { Concept, ConceptMastery, Student, AlertItem } from '../types/debt';

/**
 * Calculates Prerequisite Mastery for a given concept based on direct scores of all prerequisites.
 */
export function calculatePrerequisiteMastery(
  conceptId: string,
  concepts: Concept[],
  directScores: Record<string, number>
): number {
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));
  const targetConcept = conceptMap.get(conceptId);

  if (!targetConcept || targetConcept.prerequisites.length === 0) {
    return directScores[conceptId] ?? 100;
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  const visited = new Set<string>();

  function collectPrereqs(pId: string) {
    if (visited.has(pId)) return;
    visited.add(pId);

    const prereqObj = conceptMap.get(pId);
    if (prereqObj) {
      const score = directScores[pId] ?? 70;
      const weight = prereqObj.criticalityWeight || 1;
      totalWeightedScore += score * weight;
      totalWeight += weight;

      prereqObj.prerequisites.forEach((grandPrereqId: string) => collectPrereqs(grandPrereqId));
    }
  }

  targetConcept.prerequisites.forEach((pId: string) => collectPrereqs(pId));

  return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 100;
}

/**
 * Calculates Learning Debt Score for a single concept.
 */
export function calculateConceptDebtScore(
  _conceptId: string,
  directScore: number,
  prerequisiteMastery: number,
  criticalityWeight: number,
  overallExamGrade: number
): {
  learningDebtScore: number;
  isIllusionaryHigh: boolean;
  vulnerabilityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
} {
  const gap = Math.max(0, directScore - prerequisiteMastery);
  const baseDebt = (100 - prerequisiteMastery) * 0.65 + gap * 0.35;
  const weightFactor = 0.7 + (criticalityWeight / 5) * 0.6;
  const rawDebt = Math.round(Math.min(100, Math.max(0, baseDebt * weightFactor)));

  const isIllusionaryHigh = overallExamGrade >= 70 && prerequisiteMastery < 60;

  let vulnerabilityLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (rawDebt >= 75 || (isIllusionaryHigh && rawDebt >= 60)) {
    vulnerabilityLevel = 'Critical';
  } else if (rawDebt >= 55) {
    vulnerabilityLevel = 'High';
  } else if (rawDebt >= 30) {
    vulnerabilityLevel = 'Medium';
  }

  return {
    learningDebtScore: rawDebt,
    isIllusionaryHigh,
    vulnerabilityLevel,
  };
}

/**
 * Re-computes all concept masteries and Learning Debt Index for a student.
 */
export function evaluateStudentLearningDebt(
  student: Student,
  concepts: Concept[]
): Student {
  const directScores: Record<string, number> = {};

  concepts.forEach((c) => {
    directScores[c.id] = student.conceptMasteries[c.id]?.directScore ?? 75;
  });

  const updatedMasteries: Record<string, ConceptMastery> = {};
  let totalWeightedDebt = 0;
  let totalWeight = 0;

  concepts.forEach((concept) => {
    const directScore = directScores[concept.id];
    const prereqMastery = calculatePrerequisiteMastery(concept.id, concepts, directScores);

    const { learningDebtScore, isIllusionaryHigh, vulnerabilityLevel } = calculateConceptDebtScore(
      concept.id,
      directScore,
      prereqMastery,
      concept.criticalityWeight,
      student.overallGrade
    );

    updatedMasteries[concept.id] = {
      conceptId: concept.id,
      directScore,
      prerequisiteMastery: prereqMastery,
      learningDebtScore,
      isIllusionaryHigh,
      vulnerabilityLevel,
      lastEvaluated: new Date().toISOString().split('T')[0],
    };

    const weight = concept.criticalityWeight || 1;
    totalWeightedDebt += learningDebtScore * weight;
    totalWeight += weight;
  });

  const overallDebtIndex = totalWeight > 0 ? Math.round(totalWeightedDebt / totalWeight) : 0;

  let riskStatus: 'Healthy' | 'Moderate Debt' | 'High Debt' | 'Critical Risk' = 'Healthy';
  if (overallDebtIndex >= 65) {
    riskStatus = 'Critical Risk';
  } else if (overallDebtIndex >= 45) {
    riskStatus = 'High Debt';
  } else if (overallDebtIndex >= 25) {
    riskStatus = 'Moderate Debt';
  }

  return {
    ...student,
    learningDebtIndex: overallDebtIndex,
    riskStatus,
    conceptMasteries: updatedMasteries,
  };
}

/**
 * Generates automated Educator Alerts for hidden debt issues across a cohort.
 */
export function generateEducatorAlerts(students: Student[], concepts: Concept[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  students.forEach((student) => {
    Object.values(student.conceptMasteries).forEach((mastery) => {
      const concept = conceptMap.get(mastery.conceptId);
      if (!concept) return;

      if (mastery.isIllusionaryHigh || mastery.vulnerabilityLevel === 'Critical') {
        const keyPrereqId = concept.prerequisites[0];
        const keyPrereq = keyPrereqId ? conceptMap.get(keyPrereqId) : null;

        const severity =
          mastery.vulnerabilityLevel === 'Critical'
            ? 'critical'
            : mastery.learningDebtScore > 50
            ? 'danger'
            : 'warning';

        alerts.push({
          id: `alert-${student.id}-${concept.id}-${Date.now()}`,
          studentId: student.id,
          studentName: student.name,
          conceptId: concept.id,
          conceptName: concept.name,
          prerequisiteId: keyPrereq?.id || 'foundational-gap',
          prerequisiteName: keyPrereq?.name || 'Prerequisite Foundations',
          rawGrade: student.overallGrade,
          prereqMastery: mastery.prerequisiteMastery,
          debtScore: mastery.learningDebtScore,
          severity,
          timestamp: 'Just now',
          recommendedAction: `Assign 15-min Prerequisite Repair module: "${keyPrereq?.name || concept.name} Foundations" before starting next unit.`,
        });
      }
    });
  });

  return alerts.sort((a, b) => b.debtScore - a.debtScore);
}

/**
 * Predicts future grade drop if learning debt remains unaddressed.
 */
export function predictFutureGradeImpact(currentGrade: number, debtIndex: number): {
  predictedGradeIn3Months: number;
  gradeDrop: number;
  impactDescription: string;
} {
  const decayMultiplier = debtIndex > 60 ? 0.35 : debtIndex > 40 ? 0.22 : 0.1;
  const gradeDrop = Math.round(debtIndex * decayMultiplier);
  const predictedGradeIn3Months = Math.max(35, currentGrade - gradeDrop);

  let impactDescription = 'Low risk of grade decay. Foundations are stable.';
  if (debtIndex >= 65) {
    impactDescription = 'High risk of severe grade crash (15-25% drop) upon reaching advanced synthesis topics.';
  } else if (debtIndex >= 40) {
    impactDescription = 'Moderate risk of grade stall. Advanced topics will feel exponentially harder.';
  }

  return {
    predictedGradeIn3Months,
    gradeDrop,
    impactDescription,
  };
}
