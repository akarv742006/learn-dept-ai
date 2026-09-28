import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConceptGraph } from '../components/ConceptGraph';

export const StudentConcepts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <ConceptGraph onAssignPath={() => navigate('/student/learning-path')} />
    </div>
  );
};
