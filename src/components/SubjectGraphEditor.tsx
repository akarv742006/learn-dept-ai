import React, { useState } from 'react';
import type { SubjectData, Concept } from '../types/debt';
import {
  Wrench,
  Plus,
  Trash2,
  Zap,
  Network
} from 'lucide-react';

interface SubjectGraphEditorProps {
  subject: SubjectData;
  onUpdateSubjectConcepts: (updatedConcepts: Concept[]) => void;
}

export const SubjectGraphEditor: React.FC<SubjectGraphEditorProps> = ({
  subject,
  onUpdateSubjectConcepts,
}) => {
  const [concepts, setConcepts] = useState<Concept[]>(subject.concepts);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newConceptName, setNewConceptName] = useState('');
  const [newCategory, setNewCategory] = useState('Intermediate');
  const [newDescription, setNewDescription] = useState('');
  const [newPrereqs, setNewPrereqs] = useState<string[]>([]);
  const [newCriticality] = useState<number>(4);

  const handleTogglePrereq = (pId: string) => {
    setNewPrereqs((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const handleAddConcept = () => {
    if (!newConceptName) return;

    const newId = `custom-${Date.now()}`;
    const createdConcept: Concept = {
      id: newId,
      name: newConceptName,
      category: newCategory,
      description: newDescription || 'Educator customized concept unit.',
      prerequisites: newPrereqs,
      difficulty: 3,
      bloomsTaxonomy: 'Apply',
      criticalityWeight: newCriticality,
      position: {
        x: Math.max(...concepts.map((c) => c.position.x)) + 200,
        y: 200,
      },
    };

    const updated = [...concepts, createdConcept];
    setConcepts(updated);
    onUpdateSubjectConcepts(updated);

    setNewConceptName('');
    setNewDescription('');
    setNewPrereqs([]);
    setShowAddForm(false);
  };

  const handleDeleteConcept = (cId: string) => {
    const updated = concepts.filter((c) => c.id !== cId);
    setConcepts(updated);
    onUpdateSubjectConcepts(updated);
  };

  return (
    <div className="glass-panel bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 w-full mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Prerequisite DAG Studio & Curriculum Customizer
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Customize course concepts, prerequisite dependencies, and criticality multipliers for <strong className="text-cyan-700">{subject.name}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Concept Node</span>
        </button>
      </div>

      {showAddForm && (
        <div className="p-6 rounded-2xl bg-slate-50 border border-cyan-300 mb-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-600" />
            Configure New Curriculum Concept Node
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Concept Name</label>
              <input
                type="text"
                placeholder="e.g. Fourier Transforms & Series"
                value={newConceptName}
                onChange={(e) => setNewConceptName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600 shadow-2xs"
              >
                <option value="Foundations">Foundations</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced Synthesis">Advanced Synthesis</option>
                <option value="Applied Analysis">Applied Analysis</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-600 font-bold text-xs block mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Explain concept scope and why it relies on foundational prerequisites..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="text-slate-600 font-bold text-xs block mb-2">Select Prerequisite Dependencies</label>
            <div className="flex flex-wrap gap-2">
              {concepts.map((c) => {
                const isSelected = newPrereqs.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleTogglePrereq(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-cyan-100 text-cyan-900 border-cyan-400 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleAddConcept}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
            >
              Save Concept Node to Graph
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-slate-900 text-sm font-bold">{concept.name}</strong>
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-semibold border border-slate-200">
                  {concept.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  Criticality {concept.criticalityWeight}x
                </span>
              </div>
              <p className="text-slate-600 mt-1 text-[11px] font-medium">{concept.description}</p>
            </div>

            <button
              onClick={() => handleDeleteConcept(concept.id)}
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shrink-0 self-end sm:self-center shadow-2xs"
              title="Delete Concept"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
