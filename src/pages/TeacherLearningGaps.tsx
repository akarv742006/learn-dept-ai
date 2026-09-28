import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AIGapDetectionView } from '../components/AIGapDetectionView';
import { INITIAL_STUDENTS_LIST } from '../services/studentService';

export const TeacherLearningGaps: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <AIGapDetectionView
        students={INITIAL_STUDENTS_LIST}
        onAssignPath={() => navigate('/teacher/interventions')}
      />
    </div>
  );
};
