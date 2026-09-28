import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Sparkles, ArrowRight, Brain } from 'lucide-react';
import type { ConceptNode } from '../types/debt';
import { DBMS_CONCEPT_NODES } from '../services/studentService';
import { RiskBadge } from './RiskBadge';

// Custom Concept Node component for ReactFlow
const CustomConceptNode = ({ data }: { data: any }) => {
  const node: ConceptNode = data.node;
  const isHighRisk = node.risk === 'High' || node.risk === 'Critical';

  return (
    <div
      className={`p-3.5 rounded-2xl border-2 shadow-sm bg-white dark:bg-slate-900 w-56 text-sans transition-all hover:shadow-md cursor-pointer ${
        isHighRisk
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

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
        <span className="text-slate-500 text-[10px]">Mastery</span>
        <span className={`font-black ${isHighRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
          {node.mastery}%
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2.5 !h-2.5" />
    </div>
  );
};

const nodeTypes = {
  conceptNode: CustomConceptNode,
};

interface ConceptGraphProps {
  onAssignPath?: (conceptId: string) => void;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ onAssignPath }) => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(DBMS_CONCEPT_NODES[2]); // FD node selected by default

  const nodes = useMemo(() => {
    return DBMS_CONCEPT_NODES.map((n) => ({
      id: n.id,
      type: 'conceptNode',
      position: n.position || { x: 250, y: 100 },
      data: { node: n },
    }));
  }, []);

  const edges = useMemo(() => {
    return [
      { id: 'e1-2', source: 'db-sql', target: 'db-joins', animated: true },
      { id: 'e2-3', source: 'db-joins', target: 'db-fd', animated: true },
      { id: 'e3-4', source: 'db-fd', target: 'db-keys', animated: true },
      { id: 'e4-5', source: 'db-keys', target: 'db-norm', animated: true },
      { id: 'e5-6', source: 'db-norm', target: 'db-1nf' },
      { id: 'e5-7', source: 'db-norm', target: 'db-2nf' },
      { id: 'e7-8', source: 'db-2nf', target: 'db-3nf', animated: true },
    ];
  }, []);

  const handleNodeClick = (_: any, flowNode: any) => {
    if (flowNode.data?.node) {
      setSelectedNode(flowNode.data.node);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden font-sans space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Interactive Prerequisite Dependency Map
            </span>
            <span className="text-xs text-slate-400 font-semibold">• DBMS Subject</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Concept Dependency Graph & Root Cause Cascade
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Strong (&gt;75%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (50-74%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk (&lt;50%)</span>
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="h-[520px] w-full bg-slate-50/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls className="!bg-white dark:!bg-slate-800 dark:!text-white !border-slate-200 dark:!border-slate-700" />
        </ReactFlow>
      </div>

      {/* Side Detail Inspection Drawer */}
      {selectedNode && (
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Node Inspection Detail
              </span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Concept: {selectedNode.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={selectedNode.risk} />
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
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
              <span className="text-slate-400 text-[10px] font-bold block">Questions Correct</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {selectedNode.correctAnswers} / {selectedNode.totalAttempts}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Repeated Errors</span>
              <span className="text-lg font-black text-amber-600">
                {selectedNode.repeatedErrors} Errors
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 text-[10px] font-bold block">Last Practiced</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {selectedNode.lastPracticed}
              </span>
            </div>
          </div>

          {/* AI Reasoning Insight */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>AI Neural Root Cause Analysis:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{selectedNode.aiInsight}"
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onAssignPath && onAssignPath(selectedNode.id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Assign {selectedNode.name} Recovery Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
