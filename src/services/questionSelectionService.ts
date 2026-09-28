import { QUESTION_BANK, type QuestionBankItem } from '../data/questionBank';

export interface QuestionSelectionOptions {
  studentId: string;
  subject: string;
  concept?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'All';
  count: number;
  assessmentType: string;
  allowSeenIfExhausted?: boolean;
}

export interface QuestionSelectionResult {
  questions: QuestionBankItem[];
  remainingUnseenCount: number;
  totalAvailableCount: number;
  isExhausted: boolean;
  containsReviewQuestions: boolean;
}

/**
 * Normalizes question text for deduplication fingerprint
 */
export function generateQuestionFingerprint(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Shuffles options array while dynamically remapping the correctAnswer index
 */
export function shuffleOptions(question: QuestionBankItem): QuestionBankItem {
  const originalOptions = [...question.options];
  const correctOptionText = originalOptions[question.correctAnswer];

  // Fisher-Yates shuffle
  const shuffledOptions = [...originalOptions];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  const newCorrectAnswer = shuffledOptions.indexOf(correctOptionText);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer >= 0 ? newCorrectAnswer : 0,
  };
}

export const questionSelectionService = {
  getHistoryKey: (studentId: string, subject: string, concept: string = 'All', assessmentType: string): string => {
    return `ld_qhist_${studentId}_${subject}_${concept}_${assessmentType}`.replace(/\s+/g, '_');
  },

  getSeenQuestionIds: (studentId: string, subject: string, concept: string = 'All', assessmentType: string): string[] => {
    const key = questionSelectionService.getHistoryKey(studentId, subject, concept, assessmentType);
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  markQuestionsAsSeen: (studentId: string, subject: string, concept: string = 'All', assessmentType: string, questionIds: string[]) => {
    const key = questionSelectionService.getHistoryKey(studentId, subject, concept, assessmentType);
    const existing = questionSelectionService.getSeenQuestionIds(studentId, subject, concept, assessmentType);
    const updated = Array.from(new Set([...existing, ...questionIds]));
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save question history to localStorage');
    }
  },

  markQuestionAsSeen: (
    studentId: string,
    subject: string,
    concept: string = 'All',
    assessmentType: string,
    questionId: string,
    _isCorrect: boolean = true
  ) => {
    questionSelectionService.markQuestionsAsSeen(studentId, subject, concept, assessmentType, [questionId]);
  },

  getRemainingQuestionCount: (studentId: string, subject: string, concept: string = 'All', assessmentType: string): number => {
    const eligible = QUESTION_BANK.filter((q) => {
      const matchSub = q.subject.toLowerCase() === subject.toLowerCase();
      const matchConc = concept === 'All' || q.concept.toLowerCase() === concept.toLowerCase();
      return matchSub && matchConc;
    });
    const seenIds = questionSelectionService.getSeenQuestionIds(studentId, subject, concept, assessmentType);
    const unseen = eligible.filter((q) => !seenIds.includes(q.id));
    return unseen.length;
  },

  resetQuestionHistory: (studentId: string, subject: string, concept: string = 'All', assessmentType: string) => {
    const key = questionSelectionService.getHistoryKey(studentId, subject, concept, assessmentType);
    localStorage.removeItem(key);
  },

  getRandomQuestions: (opts: QuestionSelectionOptions): QuestionSelectionResult => {
    const {
      studentId,
      subject,
      concept = 'All',
      difficulty = 'All',
      count,
      assessmentType,
      allowSeenIfExhausted = opts.allowSeenIfExhausted ?? true,
    } = opts;

    // Filter bank by subject & concept
    let eligible = QUESTION_BANK.filter((q) => {
      const matchSub = q.subject.toLowerCase() === subject.toLowerCase();
      const matchConc = concept === 'All' || q.concept.toLowerCase() === concept.toLowerCase();
      const matchDiff = difficulty === 'All' || q.difficulty === difficulty;
      return matchSub && matchConc && matchDiff;
    });

    // Fallback if difficulty filter produces empty list
    if (eligible.length === 0) {
      eligible = QUESTION_BANK.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
    }

    // Default pool if subject filter yields zero matches
    if (eligible.length === 0) {
      eligible = QUESTION_BANK;
    }

    const seenIds = questionSelectionService.getSeenQuestionIds(studentId, subject, concept, assessmentType);
    const unseen = eligible.filter((q) => !seenIds.includes(q.id));

    let selected: QuestionBankItem[] = [];
    let isExhausted = false;
    let containsReviewQuestions = false;

    if (unseen.length >= count) {
      // Pick random unseen
      const shuffled = [...unseen].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, count);
    } else if (unseen.length > 0) {
      // Pick all unseen + remaining from seen as review questions
      selected = [...unseen];
      if (allowSeenIfExhausted) {
        const remainingNeeded = count - unseen.length;
        const seenPool = eligible.filter((q) => seenIds.includes(q.id)).sort(() => 0.5 - Math.random());
        const reviewPicks = seenPool.slice(0, remainingNeeded).map((q) => ({
          ...q,
          question: `[Review Question] ${q.question}`,
        }));
        selected = [...selected, ...reviewPicks];
        containsReviewQuestions = true;
      }
      isExhausted = true;
    } else {
      // Completely exhausted
      isExhausted = true;
      if (allowSeenIfExhausted) {
        const shuffled = [...eligible].sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, count).map((q) => ({
          ...q,
          question: `[Review Question] ${q.question}`,
        }));
        containsReviewQuestions = true;
      }
    }

    // Shuffle options for selected questions
    const finalQuestions = selected.map(shuffleOptions);

    // Track selected IDs in history
    const selectedIds = finalQuestions.map((q) => q.id);
    questionSelectionService.markQuestionsAsSeen(studentId, subject, concept, assessmentType, selectedIds);

    return {
      questions: finalQuestions,
      remainingUnseenCount: Math.max(0, unseen.length - selected.length),
      totalAvailableCount: eligible.length,
      isExhausted,
      containsReviewQuestions,
    };
  },
};
