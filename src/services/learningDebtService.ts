export interface DebtCalculationBreakdown {
  conceptWeaknessScore: number;
  prerequisiteGapScore: number;
  repeatedErrorsScore: number;
  negativeTrendScore: number;
  unresolvedPracticeScore: number;
  totalDebtScore: number;
  riskStatus: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface LearningDebtAnalysisResult {
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  weakConcepts: string[];
  rootConcept: string;
  prerequisiteGaps: string[];
  repeatedErrors: number;
  trend: string;
  explanation: string;
}

export interface StudentInputData {
  name?: string;
  examGrade?: number;
  concepts?: Array<{ name: string; score: number }>;
  repeatedErrors?: number;
  quizAttempts?: number;
  trendDelta?: number;
}

export const learningDebtService = {
  calculateLearningDebt: (
    conceptMastery: number = 40,
    prereqMastery: number = 35,
    repeatedErrors: number = 4,
    recentTrendDelta: number = -3,
    unresolvedTasks: number = 2
  ): DebtCalculationBreakdown => {
    // 1. Concept Weakness (0 to 30 pts)
    const conceptWeaknessScore = Math.round(Math.max(0, (100 - conceptMastery) * 0.3));

    // 2. Prerequisite Gap (0 to 35 pts)
    const prerequisiteGapScore = Math.round(Math.max(0, (100 - prereqMastery) * 0.35));

    // 3. Repeated Errors (0 to 15 pts)
    const repeatedErrorsScore = Math.min(15, repeatedErrors * 2);

    // 4. Negative Trend (0 to 10 pts)
    const negativeTrendScore = Math.min(10, Math.max(0, -recentTrendDelta * 2));

    // 5. Unresolved Practice Gaps (0 to 10 pts)
    const unresolvedPracticeScore = Math.min(10, unresolvedTasks * 3);

    const totalDebtScore = Math.min(
      100,
      conceptWeaknessScore + prerequisiteGapScore + repeatedErrorsScore + negativeTrendScore + unresolvedPracticeScore
    );

    let riskStatus: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (totalDebtScore >= 75) riskStatus = 'Critical';
    else if (totalDebtScore >= 50) riskStatus = 'High';
    else if (totalDebtScore >= 25) riskStatus = 'Moderate';

    return {
      conceptWeaknessScore,
      prerequisiteGapScore,
      repeatedErrorsScore,
      negativeTrendScore,
      unresolvedPracticeScore,
      totalDebtScore,
      riskStatus,
    };
  },

  /**
   * Prototype Engine scoring model for full student data evaluation
   */
  evaluateStudentDebtData: (data: StudentInputData): LearningDebtAnalysisResult => {
    const concepts = data.concepts || [
      { name: 'SQL Basics', score: 85 },
      { name: 'Joins', score: 80 },
      { name: 'Functional Dependency', score: 35 },
      { name: 'Candidate Key', score: 40 },
      { name: 'Normalization', score: 42 },
    ];

    const weakConceptsList = concepts.filter((c) => c.score < 60).map((c) => c.name);
    const rootConcept = concepts.reduce((prev, curr) => (curr.score < prev.score ? curr : prev), concepts[0]).name;

    const breakdown = learningDebtService.calculateLearningDebt(
      38, // avg weak concept score
      35, // prereq mastery
      data.repeatedErrors || 5,
      data.trendDelta || -4,
      weakConceptsList.length
    );

    const score = breakdown.totalDebtScore;
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (score >= 75) riskLevel = 'Critical';
    else if (score >= 50) riskLevel = 'High';
    else if (score >= 25) riskLevel = 'Moderate';

    return {
      score,
      riskLevel,
      weakConcepts: weakConceptsList,
      rootConcept,
      prerequisiteGaps: ['Functional Dependency', 'Attribute Closure'],
      repeatedErrors: data.repeatedErrors || 5,
      trend: data.trendDelta ? (data.trendDelta < 0 ? 'Declining' : 'Improving') : 'Declining (-4% over 3 assessments)',
      explanation: `Student demonstrates high exam score (${data.examGrade || 82}%), but unresolved prerequisite debt in ${rootConcept} degrades Candidate Key and Normalization mastery over time.`,
    };
  },
};
