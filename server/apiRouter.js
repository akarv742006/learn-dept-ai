import { callGeminiAPI, getGeminiConfig } from './geminiService.js';

/**
 * Handle incoming API requests on backend
 */
export async function handleApiRequest(req, res, path, body) {
  res.setHeader('Content-Type', 'application/json');

  // Handle GET /api/ai/status
  if (path === '/api/ai/status') {
    const config = getGeminiConfig();
    const startTime = Date.now();

    if (!config.hasKey) {
      return res.end(
        JSON.stringify({
          connected: false,
          model: config.model,
          keyConfigured: false,
          message: 'GEMINI_API_KEY environment variable is missing on server.',
          latencyMs: 0,
        })
      );
    }

    // Ping Gemini with a micro prompt
    const ping = await callGeminiAPI({
      prompt: 'Respond with OK if connected.',
      systemInstruction: 'You are a system ping healthcheck.',
    });

    const latencyMs = Date.now() - startTime;

    if (ping.success) {
      return res.end(
        JSON.stringify({
          connected: true,
          model: ping.modelUsed || config.model,
          keyConfigured: true,
          latencyMs,
          message: 'Gemini API operational',
        })
      );
    }

    return res.end(
      JSON.stringify({
        connected: false,
        model: config.model,
        keyConfigured: true,
        latencyMs,
        message: ping.error || 'Gemini API unreachable',
      })
    );
  }

  // Handle POST /api/ai/analyze-learning-gap
  if (path === '/api/ai/analyze-learning-gap') {
    const { studentName, subject, assessmentScore, concepts } = body || {};

    const prompt = `
Analyze this student's performance data for potential hidden learning gaps:
Student Name: ${studentName || 'Student'}
Subject: ${subject || 'DBMS'}
Overall Exam Mark: ${assessmentScore || 82}%
Concept Performance Scores:
${(concepts || []).map((c) => `- ${c.name}: ${c.score}%`).join('\n')}

Analyze:
1. What is the fundamental root cause weak concept?
2. Which concepts are directly impacted down the chain?
3. What is the risk level (LOW, MEDIUM, HIGH, CRITICAL)?
4. Provide a 3-step learning path recommendation.

Respond with valid JSON:
{
  "summary": "High exam score (${assessmentScore}%) conceals prerequisite weakness in Functional Dependency.",
  "detectedGaps": ["Functional Dependency", "Candidate Key"],
  "rootCause": "Weak understanding of Functional Dependency mapping.",
  "affectedConcepts": ["Candidate Key", "Normalization"],
  "riskLevel": "HIGH",
  "recommendation": "Complete Functional Dependency Foundation recovery path before advancing.",
  "learningPath": ["FD Fundamentals", "Candidate Key Rules", "1NF & 2NF Practice"]
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    // Fallback response
    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          summary: `Although ${studentName || 'the student'} scored ${assessmentScore || 82}% in the exam, foundational gaps exist in prerequisite concepts.`,
          detectedGaps: ['Functional Dependency', 'Candidate Key'],
          rootCause: 'Weak understanding of Functional Dependency attributes and closures.',
          affectedConcepts: ['Candidate Key', 'Normalization'],
          riskLevel: 'HIGH',
          recommendation: 'Complete Functional Dependency Foundation Path before moving to advanced normalization.',
          learningPath: ['Functional Dependency Basics', 'Attribute Closures & Candidate Keys', 'Normalization (1NF, 2NF, 3NF)'],
        },
      })
    );
  }

  // Handle POST /api/ai/chat
  if (path === '/api/ai/chat') {
    const { message, context } = body || {};

    const systemInstruction = `
You are LearnDebt AI, a supportive, highly intelligent EdTech AI Assistant.
Your goal is to help students detect hidden learning debt and master foundational prerequisite concepts.
Always tailor your response to the student's current weak topics.
Context about student:
- Name: ${context?.studentName || 'Akash'}
- Subjects: ${context?.subjects?.join(', ') || 'DBMS, Java, DSA'}
- Weak Concepts: ${context?.weakConcepts?.join(', ') || 'Functional Dependency, Recursion'}
- Current Learning Debt: ${context?.learningDebt || 37}/100

Keep answers concise, clear, encouraging, and structured with bullet points.
`;

    const result = await callGeminiAPI({
      prompt: message || 'What should I focus on studying today?',
      systemInstruction,
    });

    if (result.success && result.data) {
      return res.end(
        JSON.stringify({
          success: true,
          isAI: true,
          reply: typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
          suggestedPrompts: [
            'Explain Functional Dependency in simple terms',
            'Why is Normalization affected by Functional Dependency?',
            'Give me a 5-question quick quiz on DBMS',
          ],
        })
      );
    }

    // Fallback chat reply
    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        reply: `Based on your recent assessment data, your highest priority gap is **Functional Dependency** (35% mastery). Strengthening this topic will immediately improve your understanding of **Candidate Keys** and **Normalization**. Would you like me to generate a 5-question recovery quiz or a 3-day study plan?`,
        suggestedPrompts: [
          'Explain Functional Dependency in simple terms',
          'Give me a 5-question practice quiz',
          'Create a 3-day recovery study plan',
        ],
      })
    );
  }

  // Handle POST /api/ai/generate-quiz
  if (path === '/api/ai/generate-quiz') {
    const { subject = 'DBMS', topic = 'Functional Dependency', difficulty = 'medium', questionCount = 5 } = body || {};

    const prompt = `
Generate a ${difficulty} difficulty quiz for ${subject} on the topic "${topic}" with ${questionCount} multiple-choice questions.

Return JSON in format:
{
  "questions": [
    {
      "question": "What does Functional Dependency X -> Y imply?",
      "options": [
        "X uniquely determines Y",
        "Y uniquely determines X",
        "X and Y are independent",
        "X is a primary key"
      ],
      "correctAnswer": 0,
      "explanation": "X -> Y means if two tuples agree on attribute X, they must agree on attribute Y."
    }
  ]
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data && Array.isArray(result.data.questions)) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    // Fallback quiz
    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          questions: [
            {
              question: 'In a relation R(A, B, C), if A -> B holds, what does it signify?',
              options: [
                'For any two tuples with the same A value, their B values must be identical',
                'B is guaranteed to be a primary key',
                'A and B have a many-to-many relationship',
                'C is dependent on A',
              ],
              correctAnswer: 0,
              explanation: 'A functional dependency A -> B means the value of A uniquely determines the value of B in every valid tuple.',
            },
            {
              question: 'Which Armstrong axiom states that if X -> Y and Y -> Z, then X -> Z?',
              options: ['Reflexivity', 'Augmentation', 'Transitivity', 'Decomposition'],
              correctAnswer: 2,
              explanation: 'Transitivity rule: if X uniquely determines Y, and Y uniquely determines Z, then X uniquely determines Z.',
            },
            {
              question: 'What is a trivial functional dependency X -> Y?',
              options: ['Y is a subset of X', 'X is a subset of Y', 'X and Y are disjoint', 'Y contains prime attributes'],
              correctAnswer: 0,
              explanation: 'A dependency X -> Y is trivial if and only if Y ⊆ X.',
            },
            {
              question: 'If attribute set K functionally determines all attributes in relation R, K is a:',
              options: ['Foreign Key', 'Super Key', 'Composite Index', 'Secondary Key'],
              correctAnswer: 1,
              explanation: 'A Super Key is any set of attributes that functionally determines all attributes in a relation.',
            },
            {
              question: 'Why is Functional Dependency required before normalizing a table to 2NF or 3NF?',
              options: [
                'To detect partial and transitive dependencies',
                'To create SQL indexes',
                'To automatically format table headers',
                'To prevent foreign key constraints',
              ],
              correctAnswer: 0,
              explanation: '2NF eliminates partial dependencies and 3NF eliminates transitive dependencies, both of which require FD analysis.',
            },
          ],
        },
      })
    );
  }

  // Handle POST /api/ai/explain-answer
  if (path === '/api/ai/explain-answer') {
    const { question, studentAnswer, correctAnswer, topic } = body || {};

    const prompt = `
Explain this student quiz question answer:
Topic: ${topic}
Question: ${question}
Student Answer: ${studentAnswer}
Correct Answer: ${correctAnswer}

Return JSON:
{
  "explanation": "Detailed clear explanation",
  "rationale": "Why student answer was incorrect and correct answer is right",
  "practiceQuestion": "Follow-up question to test understanding"
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          explanation: `In ${topic || 'DBMS'}, the correct answer is "${correctAnswer}".`,
          rationale: `You selected "${studentAnswer}". Remember that functional dependency defines how one set of attributes uniquely determines another.`,
          practiceQuestion: 'What happens if a non-prime attribute depends on a proper subset of a candidate key?',
        },
      })
    );
  }

  // Handle POST /api/ai/create-learning-path
  if (path === '/api/ai/create-learning-path') {
    const { studentName = 'Student', subject = 'DBMS', weakConcepts = ['Functional Dependency'], learningDebt = 37 } = body || {};

    const prompt = `
Create a personalized 5-day recovery learning path for ${studentName} in ${subject}.
Weak concepts: ${weakConcepts.join(', ')}
Current Learning Debt: ${learningDebt}/100

Return JSON:
{
  "title": "DBMS Foundation Recovery Path",
  "duration": "5 days",
  "modules": [
    {
      "day": 1,
      "topic": "Functional Dependency Fundamentals",
      "duration": "35 mins",
      "activities": ["Video: FD Definition", "Attribute Closure Calculations", "5 Practice Drill Questions"]
    },
    {
      "day": 2,
      "topic": "Candidate Key Identification",
      "duration": "40 mins",
      "activities": ["Superkey vs Candidate Key", "Minimal Covers", "Hands-on Exercises"]
    },
    {
      "day": 3,
      "topic": "1NF and 2NF Normalization",
      "duration": "45 mins",
      "activities": ["Eliminating Partial Dependencies", "Table Decompositions", "Interactive Quiz"]
    },
    {
      "day": 4,
      "topic": "3NF and BCNF Mastery",
      "duration": "45 mins",
      "activities": ["Eliminating Transitive Dependencies", "Lossless Join Checks", "Case Studies"]
    },
    {
      "day": 5,
      "topic": "Diagnostic Verification Assessment",
      "duration": "30 mins",
      "activities": ["Comprehensive Recovery Test", "Learning Debt Recalculation"]
    }
  ]
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data && result.data.modules) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          title: `${subject} Prerequisite Recovery Plan`,
          duration: '5 days',
          modules: [
            {
              day: 1,
              topic: 'Functional Dependency Core Rules',
              duration: '30 minutes',
              activities: ['FD Definitions', 'Armstrong Axioms', 'Attribute Closures'],
            },
            {
              day: 2,
              topic: 'Candidate Keys & Superkeys',
              duration: '35 minutes',
              activities: ['Finding Candidate Keys', 'Prime Attributes', 'Practice Exercises'],
            },
            {
              day: 3,
              topic: 'Partial Dependencies & 2NF',
              duration: '40 minutes',
              activities: ['Detecting Partial Dependencies', '2NF Decomposition Rules'],
            },
            {
              day: 4,
              topic: 'Transitive Dependencies & 3NF',
              duration: '40 minutes',
              activities: ['3NF Criteria', 'BCNF Comparison', 'Sample Problems'],
            },
            {
              day: 5,
              topic: 'Final Recovery Quiz',
              duration: '25 minutes',
              activities: ['Diagnostic Assessment', 'Debt Recalculation Check'],
            },
          ],
        },
      })
    );
  }

  // Handle POST /api/ai/root-cause-analysis
  if (path === '/api/ai/root-cause-analysis') {
    const { studentName = 'Arun Kumar', conceptScores } = body || {};

    const prompt = `
Perform root cause analysis on this student's concept mastery:
Student: ${studentName}
Scores: ${JSON.stringify(conceptScores)}

Return JSON:
{
  "rootCause": "Functional Dependency",
  "rootCauseScore": 35,
  "affectedConcept": "Candidate Key",
  "affectedScore": 40,
  "futureImpact": "Normalization",
  "futureImpactScore": 42,
  "explanation": "Although exam marks are good, Functional Dependency weakness directly cascades into candidate key calculation errors and 3NF normalization failure."
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          rootCause: 'Functional Dependency',
          rootCauseScore: 35,
          affectedConcept: 'Candidate Key',
          affectedScore: 40,
          futureImpact: 'Normalization',
          futureImpactScore: 42,
          explanation: `Functional Dependency mastery is at 35%, causing downstream friction in Candidate Key identification (40%) and Normalization (42%).`,
        },
      })
    );
  }

  // Handle POST /api/ai/learning-debt-explanation
  if (path === '/api/ai/learning-debt-explanation') {
    const { score = 37, contributingFactors = [] } = body || {};

    const prompt = `
Explain a Learning Debt score of ${score}/100.
Contributing Factors: ${contributingFactors.join(', ')}

Return JSON:
{
  "scoreExplanation": "Your Learning Debt of ${score}/100 indicates moderate risk caused by unresolved foundational prerequisite gaps.",
  "topFactors": ["Prerequisite dependency weakness in Functional Dependency", "Repeated errors on attribute closures"],
  "recommendedAction": "Focus on clearing the 3-day Functional Dependency recovery path to reduce debt by ~15 points."
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          scoreExplanation: `Your current Learning Debt score of ${score}/100 represents unresolved foundational weaknesses that degrade future topic mastery over time.`,
          topFactors: [
            'Prerequisite weakness in Functional Dependency (71% gap contribution)',
            'Repeated conceptual errors in candidate key derivation',
          ],
          recommendedAction: 'Complete the targeted Functional Dependency recovery module to resolve 12 points of debt.',
        },
      })
    );
  }

  // Handle POST /api/ai/teacher-insights
  if (path === '/api/ai/teacher-insights') {
    const prompt = `
Generate a concise class cohort educational insight for a DBMS teacher.
Return JSON:
{
  "insightTitle": "Class Prerequisite Bottleneck Detected",
  "analysis": "14 students in III CSE demonstrate high marks in SQL queries (85%) but fail Functional Dependency closure tests (35%).",
  "recommendedAction": "Conduct a 20-minute targeted recap on Functional Dependency before starting Normalization lectures.",
  "actionItems": ["Assign Revision Quiz to 14 students", "Export Gap Analysis Report"]
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          insightTitle: 'Class Prerequisite Bottleneck Detected',
          analysis:
            '14 students demonstrate strong exam performance (avg 82%) but exhibit severe underlying weakness in Functional Dependency (avg 35%). This gap threatens upcoming Normalization topics.',
          recommendedAction: 'Assign the AI-generated Functional Dependency recovery plan to high-risk students.',
          actionItems: ['Assign Recovery Plan to Arun & 6 others', "Schedule 15-min Prerequisite Review"],
        },
      })
    );
  }

  // Handle POST /api/ai/parent-summary
  if (path === '/api/ai/parent-summary') {
    const { childName = 'Arun Kumar', overallScore = 78, debtScore = 42 } = body || {};

    const prompt = `
Create a plain-English, non-technical progress summary for a parent.
Child: ${childName}
Score: ${overallScore}%
Learning Debt: ${debtScore}/100

Return JSON:
{
  "summaryText": "${childName} is performing well academically with an overall mark of ${overallScore}%.",
  "positiveProgress": "Learning debt reduced from 72 to ${debtScore} after recent practice.",
  "focusArea": "Needs slight additional review in DBMS Normalization foundational topics.",
  "parentAdvice": "Encourage 15 minutes of daily practice on the recommended learning path."
}
`;

    const result = await callGeminiAPI({ prompt, responseJson: true });

    if (result.success && result.data) {
      return res.end(JSON.stringify({ success: true, isAI: true, data: result.data }));
    }

    return res.end(
      JSON.stringify({
        success: true,
        isAI: false,
        fallback: true,
        data: {
          summaryText: `${childName} is maintaining good overall academic performance with a score of ${overallScore}%.`,
          positiveProgress: `Learning debt has successfully decreased from 72 down to ${debtScore} following recent recovery exercises.`,
          focusArea: 'DBMS Normalization prerequisite concepts.',
          parentAdvice: 'Encourage 15 minutes of quiet daily study using the personalized study modules.',
        },
      })
    );
  }

  // Default 404 for unknown API route
  res.statusCode = 404;
  return res.end(JSON.stringify({ error: 'Endpoint not found' }));
}
