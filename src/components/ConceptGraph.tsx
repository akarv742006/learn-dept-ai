import React, { useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  X,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  Filter,
  RefreshCw,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ConceptNode } from '../types/debt';
import { RiskBadge } from './RiskBadge';
import {
  getConceptMasteryMap,
  syncSubmissionsToConceptGraph,
  recordConceptTestResult,
  type ConceptOverride
} from '../services/conceptSyncService';

// Custom Concept Node component for ReactFlow
const CustomConceptNode = ({ data }: { data: any }) => {
  const node: ConceptNode = data.node;
  const isHighRisk = node.risk === 'High' || node.risk === 'Critical';
  const isSelected = data.isSelected;

  return (
    <div
      className={`p-3.5 rounded-2xl border-2 shadow-sm bg-white dark:bg-slate-900 w-60 text-sans transition-all hover:scale-105 cursor-pointer relative ${
        isSelected
          ? 'ring-4 ring-blue-500/40 border-blue-600 dark:border-blue-400'
          : isHighRisk
          ? 'border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-950/20'
          : node.risk === 'Moderate'
          ? 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
          : 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2.5 !h-2.5" />

      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
          {node.category}
        </span>
        <RiskBadge level={node.risk} size="sm" />
      </div>

      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight mb-2">
        {node.name}
      </h4>

      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
        <span className="text-slate-500 text-[10px] font-semibold">Mastery</span>
        <div className="flex items-center gap-1.5">
          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${isHighRisk ? 'bg-rose-500' : node.risk === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${node.mastery}%` }}
            />
          </div>
          <span className={`font-black text-xs ${isHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
            {node.mastery}%
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2.5 !h-2.5" />
    </div>
  );
};

const nodeTypes = {
  conceptNode: CustomConceptNode,
};

// SUBJECT DATASETS
const MULTI_SUBJECT_DATA = {
  dbms: {
    name: 'Database Management Systems (DBMS)',
    nodes: [
      {
        id: 'db-sql',
        name: 'SQL Basics & Queries',
        category: 'Foundations',
        mastery: 88,
        risk: 'Low' as const,
        position: { x: 260, y: 30 },
        aiInsight: 'Solid syntactic foundation. Queries executed cleanly without syntax bugs.',
        correctAnswers: 22,
        totalAttempts: 25,
        repeatedErrors: 1,
        lastPracticed: 'Yesterday',
        prereqs: [],
        dependents: ['SQL Joins']
      },
      {
        id: 'db-joins',
        name: 'SQL Joins (Inner/Outer)',
        category: 'Relational Operations',
        mastery: 82,
        risk: 'Low' as const,
        position: { x: 260, y: 150 },
        aiInsight: 'Good grasp of multi-table joins. Minor ambiguity on full outer joins.',
        correctAnswers: 18,
        totalAttempts: 22,
        repeatedErrors: 2,
        lastPracticed: '2 days ago',
        prereqs: ['SQL Basics & Queries'],
        dependents: ['Functional Dependencies']
      },
      {
        id: 'db-fd',
        name: 'Functional Dependencies',
        category: 'Relational Design',
        mastery: 42,
        risk: 'Critical' as const,
        position: { x: 260, y: 280 },
        aiInsight: 'Root-cause prerequisite blocker. Confusion identifying non-trivial attributes cascades into normalization failure.',
        correctAnswers: 8,
        totalAttempts: 24,
        repeatedErrors: 7,
        lastPracticed: '3 days ago',
        prereqs: ['SQL Joins'],
        dependents: ['Candidate Keys', 'Database Normalization']
      },
      {
        id: 'db-keys',
        name: 'Candidate Keys & Closures',
        category: 'Relational Design',
        mastery: 54,
        risk: 'Moderate' as const,
        position: { x: 120, y: 410 },
        aiInsight: 'Attribute closure calculations frequently miss secondary candidate keys.',
        correctAnswers: 11,
        totalAttempts: 20,
        repeatedErrors: 4,
        lastPracticed: '4 days ago',
        prereqs: ['Functional Dependencies'],
        dependents: ['Database Normalization']
      },
      {
        id: 'db-norm',
        name: 'Database Normalization',
        category: 'Schema Design',
        mastery: 38,
        risk: 'High' as const,
        position: { x: 400, y: 410 },
        aiInsight: 'Severe learning gap. Student attempts normalization rules by rote memorization instead of testing FD closures.',
        correctAnswers: 6,
        totalAttempts: 19,
        repeatedErrors: 8,
        lastPracticed: '5 days ago',
        prereqs: ['Functional Dependencies', 'Candidate Keys'],
        dependents: ['1NF Formal Rules', '2NF Partial Dependency', '3NF & BCNF']
      },
      {
        id: 'db-1nf',
        name: '1NF Formal Rules',
        category: 'Normalization',
        mastery: 75,
        risk: 'Low' as const,
        position: { x: 80, y: 550 },
        aiInsight: 'Atomic attribute decomposition mastered.',
        correctAnswers: 15,
        totalAttempts: 20,
        repeatedErrors: 2,
        lastPracticed: '6 days ago',
        prereqs: ['Database Normalization'],
        dependents: []
      },
      {
        id: 'db-2nf',
        name: '2NF Partial Dependency',
        category: 'Normalization',
        mastery: 45,
        risk: 'High' as const,
        position: { x: 270, y: 550 },
        aiInsight: 'Fails to isolate prime attributes from non-prime attributes in composite keys.',
        correctAnswers: 7,
        totalAttempts: 18,
        repeatedErrors: 5,
        lastPracticed: '1 week ago',
        prereqs: ['Database Normalization'],
        dependents: ['3NF & BCNF']
      },
      {
        id: 'db-3nf',
        name: '3NF & BCNF Transitive Gaps',
        category: 'Normalization',
        mastery: 32,
        risk: 'Critical' as const,
        position: { x: 460, y: 550 },
        aiInsight: 'Transitive dependency test fails due to weakness in root Functional Dependencies.',
        correctAnswers: 4,
        totalAttempts: 17,
        repeatedErrors: 9,
        lastPracticed: '1 week ago',
        prereqs: ['2NF Partial Dependency', 'Database Normalization'],
        dependents: []
      }
    ],
    edges: [
      { id: 'e1-2', source: 'db-sql', target: 'db-joins', animated: true },
      { id: 'e2-3', source: 'db-joins', target: 'db-fd', animated: true },
      { id: 'e3-4', source: 'db-fd', target: 'db-keys', animated: true },
      { id: 'e3-5', source: 'db-fd', target: 'db-norm', animated: true },
      { id: 'e4-5', source: 'db-keys', target: 'db-norm' },
      { id: 'e5-6', source: 'db-norm', target: 'db-1nf' },
      { id: 'e5-7', source: 'db-norm', target: 'db-2nf', animated: true },
      { id: 'e7-8', source: 'db-2nf', target: 'db-3nf', animated: true }
    ]
  },
  dsa: {
    name: 'Data Structures & Algorithms (DSA)',
    nodes: [
      {
        id: 'dsa-arr',
        name: 'Arrays & Dynamic Arrays',
        category: 'Linear Structures',
        mastery: 92,
        risk: 'Low' as const,
        position: { x: 260, y: 30 },
        aiInsight: 'Excellent command of random access and memory layouts.',
        correctAnswers: 28,
        totalAttempts: 30,
        repeatedErrors: 1,
        lastPracticed: 'Yesterday',
        prereqs: [],
        dependents: ['Linked Lists', 'Binary Search Trees']
      },
      {
        id: 'dsa-ll',
        name: 'Linked Lists & Pointers',
        category: 'Linear Structures',
        mastery: 84,
        risk: 'Low' as const,
        position: { x: 120, y: 160 },
        aiInsight: 'Clean pointer manipulation on singly and doubly linked nodes.',
        correctAnswers: 21,
        totalAttempts: 25,
        repeatedErrors: 2,
        lastPracticed: '3 days ago',
        prereqs: ['Arrays & Dynamic Arrays'],
        dependents: ['Binary Trees']
      },
      {
        id: 'dsa-trees',
        name: 'Binary Trees & Recursion',
        category: 'Hierarchical Structures',
        mastery: 48,
        risk: 'Critical' as const,
        position: { x: 400, y: 160 },
        aiInsight: 'Root blocker gap: Recursive base-case formulation fails on tree traversals.',
        correctAnswers: 9,
        totalAttempts: 22,
        repeatedErrors: 6,
        lastPracticed: '2 days ago',
        prereqs: ['Arrays & Dynamic Arrays'],
        dependents: ['Binary Search Trees', 'Graph Traversals (BFS/DFS)']
      },
      {
        id: 'dsa-bst',
        name: 'Binary Search Trees & Heaps',
        category: 'Hierarchical Structures',
        mastery: 40,
        risk: 'High' as const,
        position: { x: 260, y: 300 },
        aiInsight: 'Inorder invariant violation and heapification index confusion.',
        correctAnswers: 7,
        totalAttempts: 19,
        repeatedErrors: 5,
        lastPracticed: '4 days ago',
        prereqs: ['Binary Trees & Recursion'],
        dependents: ['Graph Traversals (BFS/DFS)']
      },
      {
        id: 'dsa-graphs',
        name: 'Graph Traversals (BFS/DFS)',
        category: 'Non-Linear Structures',
        mastery: 35,
        risk: 'Critical' as const,
        position: { x: 140, y: 440 },
        aiInsight: 'Visited set tracking errors and queue/stack state confusion.',
        correctAnswers: 5,
        totalAttempts: 18,
        repeatedErrors: 8,
        lastPracticed: '5 days ago',
        prereqs: ['Binary Search Trees & Heaps', 'Binary Trees & Recursion'],
        dependents: ['Dijkstra & Shortest Path', 'Dynamic Programming']
      },
      {
        id: 'dsa-dijkstra',
        name: 'Dijkstra & Shortest Path',
        category: 'Greedy & Graph Algorithms',
        mastery: 30,
        risk: 'Critical' as const,
        position: { x: 380, y: 440 },
        aiInsight: 'Priority queue relaxation step fails due to weak heap foundation.',
        correctAnswers: 4,
        totalAttempts: 16,
        repeatedErrors: 7,
        lastPracticed: '6 days ago',
        prereqs: ['Graph Traversals (BFS/DFS)'],
        dependents: []
      }
    ],
    edges: [
      { id: 'edsa-1', source: 'dsa-arr', target: 'dsa-ll' },
      { id: 'edsa-2', source: 'dsa-arr', target: 'dsa-trees', animated: true },
      { id: 'edsa-3', source: 'dsa-trees', target: 'dsa-bst', animated: true },
      { id: 'edsa-4', source: 'dsa-bst', target: 'dsa-graphs', animated: true },
      { id: 'edsa-5', source: 'dsa-graphs', target: 'dsa-dijkstra', animated: true }
    ]
  },
  networks: {
    name: 'Computer Networks (CN)',
    nodes: [
      {
        id: 'net-osi',
        name: 'OSI 7-Layer Reference Model',
        category: 'Protocols & Architecture',
        mastery: 89,
        risk: 'Low' as const,
        position: { x: 260, y: 30 },
        aiInsight: 'Clean encapsulation layer mapping and PDU definitions.',
        correctAnswers: 24,
        totalAttempts: 27,
        repeatedErrors: 1,
        lastPracticed: '2 days ago',
        prereqs: [],
        dependents: ['TCP/IP Protocol Stack']
      },
      {
        id: 'net-tcp',
        name: 'TCP/IP Protocol Stack',
        category: 'Protocols & Architecture',
        mastery: 78,
        risk: 'Low' as const,
        position: { x: 260, y: 150 },
        aiInsight: 'Good understanding of 4-layer architecture vs OSI.',
        correctAnswers: 19,
        totalAttempts: 24,
        repeatedErrors: 2,
        lastPracticed: '3 days ago',
        prereqs: ['OSI 7-Layer Reference Model'],
        dependents: ['IPv4/IPv6 Addressing', 'TCP Flow Control']
      },
      {
        id: 'net-ip',
        name: 'IPv4/IPv6 Addressing',
        category: 'Network Layer',
        mastery: 52,
        risk: 'Moderate' as const,
        position: { x: 120, y: 280 },
        aiInsight: 'Root blocker: Binary octet conversion errors cause subnet masking miscalculations.',
        correctAnswers: 10,
        totalAttempts: 20,
        repeatedErrors: 5,
        lastPracticed: '4 days ago',
        prereqs: ['TCP/IP Protocol Stack'],
        dependents: ['Subnetting & CIDR']
      },
      {
        id: 'net-flow',
        name: 'TCP Flow Control & 3-Way Handshake',
        category: 'Transport Layer',
        mastery: 74,
        risk: 'Low' as const,
        position: { x: 400, y: 280 },
        aiInsight: 'Solid comprehension of SYN/ACK sequence exchange.',
        correctAnswers: 16,
        totalAttempts: 21,
        repeatedErrors: 2,
        lastPracticed: '5 days ago',
        prereqs: ['TCP/IP Protocol Stack'],
        dependents: ['Congestion Control Algorithms']
      },
      {
        id: 'net-subnet',
        name: 'Subnetting & CIDR Notation',
        category: 'Network Layer',
        mastery: 36,
        risk: 'Critical' as const,
        position: { x: 120, y: 420 },
        aiInsight: 'Major debt contributor. Broadcast and network address computation fails.',
        correctAnswers: 6,
        totalAttempts: 19,
        repeatedErrors: 8,
        lastPracticed: '5 days ago',
        prereqs: ['IPv4/IPv6 Addressing'],
        dependents: ['Routing Protocols (OSPF/BGP)']
      },
      {
        id: 'net-routing',
        name: 'Routing Protocols (OSPF/BGP)',
        category: 'Network Layer',
        mastery: 41,
        risk: 'High' as const,
        position: { x: 260, y: 550 },
        aiInsight: 'Distance vector vs link-state metric updates fail due to subnet confusion.',
        correctAnswers: 7,
        totalAttempts: 18,
        repeatedErrors: 6,
        lastPracticed: '6 days ago',
        prereqs: ['Subnetting & CIDR Notation'],
        dependents: []
      }
    ],
    edges: [
      { id: 'enet-1', source: 'net-osi', target: 'net-tcp', animated: true },
      { id: 'enet-2', source: 'net-tcp', target: 'net-ip', animated: true },
      { id: 'enet-3', source: 'net-tcp', target: 'net-flow' },
      { id: 'enet-4', source: 'net-ip', target: 'net-subnet', animated: true },
      { id: 'enet-5', source: 'net-subnet', target: 'net-routing', animated: true }
    ]
  }
};

interface ConceptGraphProps {
  onAssignPath?: (conceptId: string) => void;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ onAssignPath }) => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<'dbms' | 'dsa' | 'networks'>('dbms');
  const [filterMode, setFilterMode] = useState<'all' | 'bottlenecks' | 'high_risk' | 'mastered'>('all');
  const [simulatedBoost, setSimulatedBoost] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [masteryMap, setMasteryMap] = useState<Record<string, ConceptOverride>>(getConceptMasteryMap);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const currentDataset = MULTI_SUBJECT_DATA[activeSubject];

  // Active nodes dynamically merged with live test completion overrides
  const activeNodes = useMemo(() => {
    return currentDataset.nodes.map((n) => {
      const override = masteryMap[n.id];
      if (!override) return n;
      return {
        ...n,
        mastery: override.mastery,
        risk: override.risk,
        correctAnswers: override.correctAnswers ?? n.correctAnswers,
        totalAttempts: override.totalAttempts ?? n.totalAttempts,
        repeatedErrors: override.repeatedErrors ?? n.repeatedErrors,
        lastPracticed: override.lastPracticed || n.lastPracticed,
        aiInsight: override.aiInsight || n.aiInsight,
      };
    });
  }, [currentDataset, masteryMap]);

  const [selectedNode, setSelectedNode] = useState<any>(activeNodes[2] || activeNodes[0]);

  // Keep selected node up to date when masteryMap updates
  useEffect(() => {
    if (selectedNode) {
      const match = activeNodes.find((n) => n.id === selectedNode.id);
      if (match) setSelectedNode(match);
    }
  }, [activeNodes]);

  // Synchronize past tests and listen for new live test submissions
  useEffect(() => {
    // 1. Initial sync of all submissions from localStorage
    const synced = syncSubmissionsToConceptGraph();
    setMasteryMap(synced);

    // 2. Listeners for live events
    const onConceptUpdated = (e: any) => {
      const detail = e.detail;
      const updated = getConceptMasteryMap();
      setMasteryMap(updated);
      if (detail?.subjectKey && detail.subjectKey !== activeSubject) {
        setActiveSubject(detail.subjectKey);
      }
      setSyncToast(`🟢 Graph Updated! ${detail?.conceptDisplayName || 'Concept'} mastery increased to ${detail?.percentage || 80}%`);
      setTimeout(() => setSyncToast(null), 5000);
    };

    const onTestSubmitted = (e: any) => {
      const sub = e.detail;
      const updated = syncSubmissionsToConceptGraph();
      setMasteryMap(updated);
      if (sub?.assignmentTitle || sub?.subject) {
        setSyncToast(`🟢 Live Test Synced: "${sub.assignmentTitle || sub.subject}" (${sub.percentage}%) applied to concept network!`);
      } else {
        setSyncToast('🟢 Live Test Synced: Concept Graph updated in real-time!');
      }
      setTimeout(() => setSyncToast(null), 5000);
    };

    window.addEventListener('learndebt_concept_updated', onConceptUpdated);
    window.addEventListener('learndebt_test_submitted', onTestSubmitted);
    window.addEventListener('storage', onTestSubmitted);

    return () => {
      window.removeEventListener('learndebt_concept_updated', onConceptUpdated);
      window.removeEventListener('learndebt_test_submitted', onTestSubmitted);
      window.removeEventListener('storage', onTestSubmitted);
    };
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    const updated = syncSubmissionsToConceptGraph();
    setMasteryMap(updated);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('Concept Graph successfully refreshed with all past student assessments!');
      setTimeout(() => setSyncToast(null), 4000);
    }, 500);
  };

  // Quick simulation trigger for testing
  const handleSimulatePassedTest = (node: any) => {
    const res = recordConceptTestResult({
      subject: activeSubject === 'dsa' ? 'Data Structures' : activeSubject === 'networks' ? 'Computer Networks' : 'DBMS',
      concept: node.id,
      assignmentTitle: `${node.name} Diagnostic Check`,
      percentage: 85,
      score: 40,
      maxScore: 50,
      correctAnswers: 4,
      totalQuestions: 5,
      passed: true
    });
    setMasteryMap({ ...res.masteryMap });
    setSyncToast(`🎉 Test Passed! ${node.name} updated to 85% Mastery (Low Risk)!`);
    setTimeout(() => setSyncToast(null), 4500);
  };

  // Handle subject change
  const handleSubjectChange = (subj: 'dbms' | 'dsa' | 'networks') => {
    setActiveSubject(subj);
    const nodes = MULTI_SUBJECT_DATA[subj].nodes.map((n) => {
      const override = masteryMap[n.id];
      return override ? { ...n, ...override } : n;
    });
    setSelectedNode(nodes[2] || nodes[0]);
    setSimulatedBoost(0);
    setIsSimulating(false);
  };

  // Filtered nodes with interactive simulated recovery boost
  const flowNodes = useMemo(() => {
    return activeNodes
      .filter((n) => {
        if (filterMode === 'bottlenecks') return n.risk === 'Critical';
        if (filterMode === 'high_risk') return n.mastery < 50;
        if (filterMode === 'mastered') return n.mastery >= 75;
        return true;
      })
      .map((n) => {
        // If simulation active and node is downstream of root gap
        let dynamicMastery = n.mastery;
        let dynamicRisk = n.risk;
        if (isSimulating && simulatedBoost > 0) {
          if (n.id === activeNodes[2]?.id) {
            dynamicMastery = Math.min(100, n.mastery + simulatedBoost);
          } else if (n.mastery < 70) {
            dynamicMastery = Math.min(100, n.mastery + Math.round(simulatedBoost * 0.7));
          }
          dynamicRisk = dynamicMastery >= 75 ? 'Low' : dynamicMastery >= 50 ? 'Moderate' : 'High';
        }

        return {
          id: n.id,
          type: 'conceptNode',
          position: n.position || { x: 250, y: 100 },
          data: {
            node: { ...n, mastery: dynamicMastery, risk: dynamicRisk },
            isSelected: selectedNode?.id === n.id,
          },
        };
      });
  }, [activeNodes, filterMode, selectedNode, isSimulating, simulatedBoost]);

  const flowEdges = useMemo(() => {
    return currentDataset.edges;
  }, [currentDataset]);

  const handleNodeClick = (_: any, flowNode: any) => {
    if (flowNode.data?.node) {
      setSelectedNode(flowNode.data.node);
    }
  };

  // Graph KPI metrics
  const totalConcepts = activeNodes.length;
  const criticalGaps = activeNodes.filter((n) => n.risk === 'Critical').length;
  const masteredCount = activeNodes.filter((n) => n.mastery >= 75).length;
  const simulatedDebtReduction = Math.round(simulatedBoost * 0.45);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden font-sans space-y-5">
      
      {/* Top Header & Subject Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-500" />
              Interactive Concept DAG Network
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Directed Acyclic Graph</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Prerequisite Dependency Graph & Root Cause Cascade
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore how foundational prerequisite failures cascade into downstream assessment debt.
          </p>
        </div>

        {/* Multi-Subject Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {(
            [
              { id: 'dbms', label: 'DBMS' },
              { id: 'dsa', label: 'DSA & Algorithms' },
              { id: 'networks', label: 'Networks' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => handleSubjectChange(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubject === s.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Synchronization Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            Real-Time Assessment Sync:
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            {syncToast || "Completing any test instantly updates node mastery, risk colors, and resolves prerequisite debt in real-time."}
          </span>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-xs transition cursor-pointer self-end sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Test Results'}</span>
        </button>
      </div>

      {/* KPI Stats & Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Concepts</span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">{totalConcepts} Nodes</span>
        </div>

        <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 text-xs">
          <span className="text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase block">Root Cause Gaps</span>
          <span className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5 block">{criticalGaps} Bottlenecks</span>
        </div>

        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase block">Mastered Concepts</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{masteredCount} Cleared</span>
        </div>

        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 text-xs">
          <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase block">Prerequisite Depth</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">Level 4 Deep</span>
        </div>
      </div>

      {/* Filter Mode & Simulation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {(
            [
              { id: 'all', label: 'All Concepts' },
              { id: 'bottlenecks', label: 'Root Cause Gaps' },
              { id: 'high_risk', label: 'Weakness (<50%)' },
              { id: 'mastered', label: 'Mastered (>75%)' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                filterMode === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Interactive Debt Remediation Simulator Slider */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Simulate Root Gap Repair:
          </span>
          <input
            type="range"
            min="0"
            max="50"
            value={simulatedBoost}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSimulatedBoost(val);
              setIsSimulating(val > 0);
            }}
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 min-w-[40px] text-right">
            +{simulatedBoost}%
          </span>
          {simulatedBoost > 0 && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md whitespace-nowrap">
              Debt -{simulatedDebtReduction} pts!
            </span>
          )}
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="h-[520px] w-full bg-slate-50/70 dark:bg-slate-950/80 rounded-2xl border border-slate-200/90 dark:border-slate-800 relative">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls className="!bg-white dark:!bg-slate-800 dark:!text-white !border-slate-200 dark:!border-slate-700" />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] space-y-1 shadow-xs pointer-events-none">
          <div className="font-extrabold uppercase text-slate-400">Legend:</div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strong (&gt;75%)
          </div>
          <div className="flex items-center gap-1.5 font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Developing (50-74%)
          </div>
          <div className="flex items-center gap-1.5 font-bold text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Blocker / High Debt (&lt;50%)
          </div>
        </div>
      </div>

      {/* Side Detail Inspection Drawer */}
      {selectedNode && (
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Concept Inspector • {currentDataset.name}
              </span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedNode.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={selectedNode.risk} />
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Concept Mastery</span>
              <span className={`text-lg font-black ${selectedNode.mastery < 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {selectedNode.mastery}%
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Diagnostic Accuracy</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {selectedNode.correctAnswers || 8} / {selectedNode.totalAttempts || 20}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Repeated Errors</span>
              <span className="text-lg font-black text-amber-600">
                {selectedNode.repeatedErrors || 3} Gaps
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Last Assessed</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {selectedNode.lastPracticed || 'Recent'}
              </span>
            </div>
          </div>

          {/* Upstream & Downstream Dependencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Upstream Prerequisites:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.prereqs && selectedNode.prereqs.length > 0 ? (
                  selectedNode.prereqs.map((p: string) => (
                    <span key={p} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-blue-800">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-[11px] italic">Root foundational concept</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Downstream Blocked Concepts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.dependents && selectedNode.dependents.length > 0 ? (
                  selectedNode.dependents.map((d: string) => (
                    <span key={d} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-[11px] italic">Terminal node in DAG</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Neural Root Cause Insight */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>AI Neural Root Cause Analysis:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{selectedNode.aiInsight}"
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const subjParam = activeSubject === 'dsa' ? 'Data Structures' : activeSubject === 'networks' ? 'Computer Networks' : 'DBMS';
                  navigate(`/student/quiz?subject=${encodeURIComponent(subjParam)}&concept=${encodeURIComponent(selectedNode.id)}`);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Take Diagnostic Quiz on {selectedNode.name}</span>
              </button>

              <button
                onClick={() => handleSimulatePassedTest(selectedNode)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 transition cursor-pointer"
                title="Simulate student completing this test with 85% to immediately verify node recovery and downstream unblocking"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Simulate Passed Test (+40%)</span>
              </button>
            </div>

            <button
              onClick={() => onAssignPath && onAssignPath(selectedNode.id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Assign {selectedNode.name} Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptGraph;
