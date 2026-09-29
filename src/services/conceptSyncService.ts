export interface ConceptOverride {
  id: string;
  mastery: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
  correctAnswers: number;
  totalAttempts: number;
  repeatedErrors: number;
  lastPracticed: string;
  aiInsight: string;
}

export type SubjectKey = 'dbms' | 'dsa' | 'networks';

export interface ConceptMappingResult {
  subjectKey: SubjectKey;
  primaryNodeIds: string[];
  downstreamNodeIds: string[];
  conceptDisplayName: string;
}

/**
 * Maps any test subject, concept code, or title into exact ConceptGraph node IDs
 */
export function mapTestToConceptNodes(
  subject?: string,
  concept?: string,
  assignmentTitle?: string
): ConceptMappingResult {
  const s = (subject || '').toLowerCase();
  const c = (concept || '').toLowerCase();
  const t = (assignmentTitle || '').toLowerCase();

  // 1. Data Structures & Algorithms
  if (
    s.includes('data') ||
    s.includes('dsa') ||
    s.includes('algorithm') ||
    t.includes('tree') ||
    t.includes('graph') ||
    t.includes('array') ||
    t.includes('dsa') ||
    c.includes('bst') ||
    c.includes('tree')
  ) {
    if (c.includes('bst') || t.includes('bst') || t.includes('binary search tree')) {
      return {
        subjectKey: 'dsa',
        primaryNodeIds: ['dsa-bst'],
        downstreamNodeIds: ['dsa-graphs'],
        conceptDisplayName: 'Binary Search Trees & Heaps'
      };
    }
    if (c.includes('recursion') || t.includes('tree') || t.includes('recursion')) {
      return {
        subjectKey: 'dsa',
        primaryNodeIds: ['dsa-trees'],
        downstreamNodeIds: ['dsa-bst', 'dsa-graphs'],
        conceptDisplayName: 'Binary Trees & Recursion'
      };
    }
    if (c.includes('graph') || t.includes('graph') || t.includes('bfs') || t.includes('dfs')) {
      return {
        subjectKey: 'dsa',
        primaryNodeIds: ['dsa-graphs', 'dsa-dijkstra'],
        downstreamNodeIds: ['dsa-dp'],
        conceptDisplayName: 'Graph Traversals (BFS/DFS)'
      };
    }
    if (c.includes('dp') || c.includes('dynamic') || t.includes('dynamic')) {
      return {
        subjectKey: 'dsa',
        primaryNodeIds: ['dsa-dp'],
        downstreamNodeIds: [],
        conceptDisplayName: 'Dynamic Programming & Memoization'
      };
    }
    return {
      subjectKey: 'dsa',
      primaryNodeIds: ['dsa-trees', 'dsa-bst'],
      downstreamNodeIds: ['dsa-graphs'],
      conceptDisplayName: 'Binary Trees & Recursion'
    };
  }

  // 2. Computer Networks
  if (
    s.includes('network') ||
    t.includes('network') ||
    t.includes('tcp') ||
    t.includes('ip') ||
    c.includes('subnet') ||
    c.includes('tcp')
  ) {
    if (c.includes('subnet') || t.includes('subnet') || t.includes('cidr')) {
      return {
        subjectKey: 'networks',
        primaryNodeIds: ['net-subnet', 'net-ip'],
        downstreamNodeIds: ['net-routing'],
        conceptDisplayName: 'Subnetting & CIDR Notation'
      };
    }
    if (c.includes('tcp') || c.includes('osi') || t.includes('handshake')) {
      return {
        subjectKey: 'networks',
        primaryNodeIds: ['net-tcp', 'net-osi'],
        downstreamNodeIds: ['net-flow'],
        conceptDisplayName: 'TCP 3-Way Handshake & Flow Control'
      };
    }
    return {
      subjectKey: 'networks',
      primaryNodeIds: ['net-subnet', 'net-tcp'],
      downstreamNodeIds: ['net-routing'],
      conceptDisplayName: 'Subnetting & Network Protocols'
    };
  }

  // 3. DBMS (Default Flagship)
  if (c.includes('norm') || t.includes('norm') || t.includes('1nf') || t.includes('2nf') || t.includes('3nf')) {
    return {
      subjectKey: 'dbms',
      primaryNodeIds: ['db-norm', 'db-2nf'],
      downstreamNodeIds: ['db-3nf'],
      conceptDisplayName: 'Database Normalization'
    };
  }
  if (c.includes('join') || c.includes('sql') || t.includes('join') || t.includes('query')) {
    return {
      subjectKey: 'dbms',
      primaryNodeIds: ['db-joins', 'db-sql'],
      downstreamNodeIds: ['db-fd'],
      conceptDisplayName: 'SQL Joins & Relational Operations'
    };
  }

  // Default: Functional Dependencies (Root Prerequisite Gap)
  return {
    subjectKey: 'dbms',
    primaryNodeIds: ['db-fd'],
    downstreamNodeIds: ['db-norm', 'db-keys', 'db-2nf', 'db-3nf'],
    conceptDisplayName: 'Functional Dependencies'
  };
}

/**
 * Baseline initial masteries to start calculations from
 */
const BASELINE_NODE_DATA: Record<string, Partial<ConceptOverride>> = {
  'db-sql': { mastery: 88, risk: 'Low', correctAnswers: 22, totalAttempts: 25, repeatedErrors: 1 },
  'db-joins': { mastery: 82, risk: 'Low', correctAnswers: 18, totalAttempts: 22, repeatedErrors: 2 },
  'db-fd': { mastery: 42, risk: 'Critical', correctAnswers: 8, totalAttempts: 24, repeatedErrors: 7 },
  'db-keys': { mastery: 54, risk: 'Moderate', correctAnswers: 11, totalAttempts: 20, repeatedErrors: 4 },
  'db-norm': { mastery: 38, risk: 'High', correctAnswers: 6, totalAttempts: 19, repeatedErrors: 8 },
  'db-1nf': { mastery: 75, risk: 'Low', correctAnswers: 15, totalAttempts: 20, repeatedErrors: 2 },
  'db-2nf': { mastery: 45, risk: 'High', correctAnswers: 7, totalAttempts: 18, repeatedErrors: 5 },
  'db-3nf': { mastery: 32, risk: 'Critical', correctAnswers: 4, totalAttempts: 17, repeatedErrors: 9 },

  'dsa-arr': { mastery: 92, risk: 'Low', correctAnswers: 28, totalAttempts: 30, repeatedErrors: 1 },
  'dsa-ll': { mastery: 84, risk: 'Low', correctAnswers: 21, totalAttempts: 25, repeatedErrors: 2 },
  'dsa-trees': { mastery: 48, risk: 'Critical', correctAnswers: 9, totalAttempts: 22, repeatedErrors: 6 },
  'dsa-bst': { mastery: 40, risk: 'High', correctAnswers: 7, totalAttempts: 19, repeatedErrors: 5 },
  'dsa-graphs': { mastery: 35, risk: 'Critical', correctAnswers: 5, totalAttempts: 18, repeatedErrors: 8 },
  'dsa-dijkstra': { mastery: 28, risk: 'Critical', correctAnswers: 4, totalAttempts: 16, repeatedErrors: 7 },
  'dsa-dp': { mastery: 22, risk: 'Critical', correctAnswers: 3, totalAttempts: 15, repeatedErrors: 9 },

  'net-osi': { mastery: 86, risk: 'Low', correctAnswers: 20, totalAttempts: 24, repeatedErrors: 1 },
  'net-tcp': { mastery: 68, risk: 'Moderate', correctAnswers: 15, totalAttempts: 22, repeatedErrors: 3 },
  'net-ip': { mastery: 58, risk: 'Moderate', correctAnswers: 13, totalAttempts: 22, repeatedErrors: 4 },
  'net-flow': { mastery: 52, risk: 'Moderate', correctAnswers: 11, totalAttempts: 21, repeatedErrors: 5 },
  'net-subnet': { mastery: 36, risk: 'Critical', correctAnswers: 6, totalAttempts: 19, repeatedErrors: 7 },
  'net-routing': { mastery: 41, risk: 'High', correctAnswers: 7, totalAttempts: 18, repeatedErrors: 6 }
};

/**
 * Get current concept mastery override map from localStorage
 */
export function getConceptMasteryMap(): Record<string, ConceptOverride> {
  try {
    const raw = localStorage.getItem('learndebt_concept_mastery');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

/**
 * Record a test completion and immediately recalculate and persist concept mastery graph
 */
export function recordConceptTestResult(params: {
  subject?: string;
  concept?: string;
  assignmentTitle?: string;
  percentage: number;
  score?: number;
  maxScore?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  passed?: boolean;
}): {
  subjectKey: SubjectKey;
  updatedNodes: string[];
  masteryMap: Record<string, ConceptOverride>;
} {
  const { subject, concept, assignmentTitle, percentage } = params;
  const mapping = mapTestToConceptNodes(subject, concept, assignmentTitle);
  const currentMap = getConceptMasteryMap();
  const nowStr = 'Just now (Test Completed)';

  const updatedIds: string[] = [];

  // Update primary tested nodes
  mapping.primaryNodeIds.forEach((nodeId) => {
    const prev = currentMap[nodeId] || BASELINE_NODE_DATA[nodeId] || {
      mastery: 40,
      risk: 'High',
      correctAnswers: 5,
      totalAttempts: 15,
      repeatedErrors: 6
    };

    const prevMastery = prev.mastery || 40;
    // Boost mastery based on test score
    const newMastery = Math.min(
      100,
      Math.max(prevMastery, percentage, Math.round(prevMastery * 0.2 + percentage * 0.8))
    );

    const newRisk = newMastery >= 75 ? 'Low' : newMastery >= 50 ? 'Moderate' : 'Critical';
    const addedCorrect = params.correctAnswers ?? Math.round((percentage / 100) * 5);
    const addedTotal = params.totalQuestions ?? 5;
    const errorsReduction = percentage >= 60 ? 4 : 1;

    currentMap[nodeId] = {
      id: nodeId,
      mastery: newMastery,
      risk: newRisk,
      correctAnswers: (prev.correctAnswers || 10) + addedCorrect,
      totalAttempts: (prev.totalAttempts || 20) + addedTotal,
      repeatedErrors: Math.max(0, (prev.repeatedErrors || 5) - errorsReduction),
      lastPracticed: nowStr,
      aiInsight:
        percentage >= 70
          ? `Cleared diagnostic benchmark with ${percentage}% exam accuracy! Prerequisite gap resolved.`
          : `Assessed on recent diagnostic (${percentage}% accuracy). Practice recommended.`
    };
    updatedIds.push(nodeId);
  });

  // Cascade improvement into downstream dependent nodes if test passed
  if (percentage >= 50) {
    mapping.downstreamNodeIds.forEach((nodeId) => {
      const prev = currentMap[nodeId] || BASELINE_NODE_DATA[nodeId] || {
        mastery: 35,
        risk: 'High',
        correctAnswers: 6,
        totalAttempts: 18,
        repeatedErrors: 6
      };

      const prevMastery = prev.mastery || 35;
      const boost = Math.round(percentage * 0.22);
      const newMastery = Math.min(100, prevMastery + boost);
      const newRisk = newMastery >= 75 ? 'Low' : newMastery >= 50 ? 'Moderate' : 'High';

      currentMap[nodeId] = {
        id: nodeId,
        mastery: newMastery,
        risk: newRisk,
        correctAnswers: (prev.correctAnswers || 8) + 2,
        totalAttempts: (prev.totalAttempts || 18) + 2,
        repeatedErrors: Math.max(0, (prev.repeatedErrors || 5) - 2),
        lastPracticed: nowStr,
        aiInsight: `Prerequisite blocker cleared! Downstream conceptual confidence boosted to ${newMastery}%.`
      };
      updatedIds.push(nodeId);
    });
  }

  // Persist to localStorage
  try {
    localStorage.setItem('learndebt_concept_mastery', JSON.stringify(currentMap));
    localStorage.setItem(
      'learndebt_latest_concept_update',
      JSON.stringify({
        subjectKey: mapping.subjectKey,
        conceptDisplayName: mapping.conceptDisplayName,
        primaryNodeIds: mapping.primaryNodeIds,
        percentage,
        timestamp: new Date().toISOString()
      })
    );

    // Dispatch global events for instant reactivity across active components and tabs
    window.dispatchEvent(
      new CustomEvent('learndebt_concept_updated', {
        detail: {
          subjectKey: mapping.subjectKey,
          conceptDisplayName: mapping.conceptDisplayName,
          updatedNodeIds: updatedIds,
          percentage,
          masteryMap: currentMap
        }
      })
    );
  } catch (e) {
    console.warn('Concept mastery persist notice:', e);
  }

  return {
    subjectKey: mapping.subjectKey,
    updatedNodes: updatedIds,
    masteryMap: currentMap
  };
}

/**
 * Scan all stored submissions and backfill/sync the concept graph mastery map
 */
export function syncSubmissionsToConceptGraph(): Record<string, ConceptOverride> {
  let subs: any[] = [];
  try {
    subs = JSON.parse(localStorage.getItem('learndebt_submissions') || '[]');
    const latest = JSON.parse(localStorage.getItem('learndebt_latest_submission') || 'null');
    if (latest && !subs.some((s) => s._id === latest._id || s.id === latest.id)) {
      subs.unshift(latest);
    }
  } catch {}

  if (subs.length === 0) {
    return getConceptMasteryMap();
  }

  // Process oldest to newest so latest test takes precedence
  const sorted = [...subs].reverse();
  sorted.forEach((sub) => {
    recordConceptTestResult({
      subject: sub.subject || sub.assignmentTitle || 'DBMS',
      concept: sub.conceptId || sub.concept || '',
      assignmentTitle: sub.assignmentTitle || '',
      percentage: Number(sub.percentage) || 50,
      score: sub.score,
      maxScore: sub.maxScore,
      correctAnswers: sub.correctAnswers,
      totalQuestions: sub.totalQuestions,
      passed: sub.passed
    });
  });

  return getConceptMasteryMap();
}
