import { apiRequest } from './client';

export interface Question {
  id: string;
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  department?: string;
  subjectId?: string;
  conceptId?: string;
  difficulty?: string;
  bloomLevel?: string;
  source?: string;
  createdBy?: string;
}

export interface AssessmentGenerateResponse {
  assessmentId: string;
  questions: Question[];
  totalQuestions: number;
  unseenQuestionsRemaining: number;
  exhausted: boolean;
  message?: string;
}

export interface AnswerSubmitItem {
  questionId: string;
  selectedAnswer: number | string;
}

export interface QuestionReviewItem {
  questionId: string;
  question: string;
  options: string[];
  selectedAnswer: number | string;
  selectedAnswerText?: string;
  correctAnswer: number;
  correctAnswerText?: string;
  isCorrect: boolean;
  marks?: number;
  explanation?: string;
  conceptId?: string;
  subjectId?: string;
  bloomLevel?: string;
}

export interface AssessmentSubmitResponse {
  assessmentId: string;
  status: string;
  score: number;
  maxScore?: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  passed?: boolean;
  timeTaken?: number;
  learningDebt: number;
  riskLevel: string;
  alreadySubmitted?: boolean;
  review?: QuestionReviewItem[];
}

export interface StaffQuestionPayload {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  department: string;
  subjectId: string;
  conceptId: string;
  difficulty: string;
  bloomLevel?: string;
  createdBy?: string;
  tags?: string[];
}

export interface StaffAssignmentPayload {
  title: string;
  description?: string;
  department: string;
  targetYear?: string;
  subjectId: string;
  conceptId?: string;
  durationMinutes?: number;
  questionIds?: string[];
  questions?: StaffQuestionPayload[];
  assignedBy?: string;
  dueDate?: string;
}

export interface DepartmentAssignment {
  _id: string;
  title: string;
  description?: string;
  department: string;
  targetYear?: string;
  subjectId: string;
  conceptId?: string;
  durationMinutes: number;
  questionIds: string[];
  assignedBy: string;
  dueDate?: string;
  submissionsCount?: number;
  averageScore?: number;
  status: string;
  createdAt: string;
}

export interface StudentSubmission {
  _id: string;
  assessmentId: string;
  assignmentId?: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department: string;
  year?: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  timeTaken: number;
  submittedAt: string;
  review?: QuestionReviewItem[];
}

export interface CohortWeakness {
  conceptId: string;
  subjectId: string;
  failureRate: number;
  title?: string;
  weaknessText: string;
}

export interface StaffAIQuestionGenPayload {
  department: string;
  subjectId: string;
  conceptId?: string;
  weaknessText?: string;
  difficulty?: string;
  bloomLevel?: string;
  count?: number;
  saveDirectly?: boolean;
  createdBy?: string;
}

export const assessmentApi = {
  generate: async (params: {
    studentId: string;
    subjectId: string;
    conceptId?: string;
    difficulty?: string;
    questionCount?: number;
    assessmentType?: string;
    department?: string;
    assignmentId?: string;
  }): Promise<AssessmentGenerateResponse> => {
    return apiRequest<AssessmentGenerateResponse>('/assessments/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  submit: async (
    assessmentId: string,
    answers: AnswerSubmitItem[],
    timeTaken: number = 120
  ): Promise<AssessmentSubmitResponse> => {
    return apiRequest<AssessmentSubmitResponse>(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeTaken }),
    });
  },

  getDepartments: async (): Promise<string[]> => {
    try {
      const res = await apiRequest<{ departments: string[] }>('/questions/departments');
      return res.departments;
    } catch (e) {
      return [
        'Computer Science',
        'Information Technology',
        'Electronics & Communication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering'
      ];
    }
  },

  getQuestions: async (params?: {
    department?: string;
    subject?: string;
    concept?: string;
    difficulty?: string;
  }): Promise<Question[]> => {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.subject) query.append('subject', params.subject);
    if (params?.concept) query.append('concept', params.concept);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Question[]>(`/questions${qs}`);
  },

  createStaffQuestion: async (payload: StaffQuestionPayload): Promise<any> => {
    return apiRequest('/questions/create', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteQuestion: async (questionId: string): Promise<any> => {
    return apiRequest(`/questions/${questionId}`, {
      method: 'DELETE'
    });
  },

  createStaffAssignment: async (payload: StaffAssignmentPayload): Promise<any> => {
    return apiRequest('/assessments/staff-create', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getDepartmentAssignments: async (department?: string): Promise<DepartmentAssignment[]> => {
    const qs = department && department !== 'All' ? `?department=${encodeURIComponent(department)}` : '';
    return apiRequest<DepartmentAssignment[]>(`/assessments/department-assignments${qs}`);
  },

  getSubmissions: async (params?: {
    assignmentId?: string;
    department?: string;
    studentId?: string;
  }): Promise<StudentSubmission[]> => {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.assignmentId) query.append('assignmentId', params.assignmentId);
    if (params?.department && params.department !== 'All') query.append('department', params.department);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<StudentSubmission[]>(`/assessments/submissions${qs}`);
  },

  getAssessmentReview: async (assessmentId: string): Promise<any> => {
    return apiRequest(`/assessments/${assessmentId}/review`);
  },

  getCohortWeaknesses: async (department?: string): Promise<{ department: string; weaknesses: CohortWeakness[] }> => {
    const qs = department && department !== 'All' ? `?department=${encodeURIComponent(department)}` : '';
    return apiRequest<{ department: string; weaknesses: CohortWeakness[] }>(`/questions/cohort-weaknesses${qs}`);
  },

  generateFromWeakness: async (payload: StaffAIQuestionGenPayload): Promise<{
    success: boolean;
    count: number;
    department: string;
    subjectId: string;
    conceptId: string;
    weaknessAnalyzed: string;
    questions: any[];
  }> => {
    return apiRequest('/questions/ai-generate-from-weakness', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  batchCreateQuestions: async (questions: StaffQuestionPayload[]): Promise<{
    success: boolean;
    count: number;
    message: string;
    questions: any[];
  }> => {
    return apiRequest('/questions/batch-create', {
      method: 'POST',
      body: JSON.stringify({ questions })
    });
  }
};

