export const analyticsService = {
  getLearningDebtTrendData: () => {
    return [
      { week: 'Week 1', debt: 18, benchmark: 20 },
      { week: 'Week 2', debt: 25, benchmark: 20 },
      { week: 'Week 3', debt: 31, benchmark: 20 },
      { week: 'Week 4', debt: 37, benchmark: 20 },
    ];
  },
  getRiskDistribution: () => {
    return [
      { name: 'Low Risk', value: 38, color: '#10b981' },
      { name: 'Medium Risk', value: 15, color: '#f59e0b' },
      { name: 'High Risk', value: 7, color: '#ef4444' },
    ];
  },
  getMostDifficultConcepts: () => {
    return [
      { concept: 'Normalization (3NF/BCNF)', mastery: 42, affectedStudents: 22 },
      { concept: 'Recursion Call Stack', mastery: 48, affectedStudents: 18 },
      { concept: 'Trigonometric Calculus Integration', mastery: 57, affectedStudents: 14 },
      { concept: 'Linked List Pointers', mastery: 61, affectedStudents: 11 },
    ];
  },
};
