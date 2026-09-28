import type { NotificationItem, UserRole } from '../types/debt';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'student',
    title: 'High Learning Debt Warning',
    message: 'High Learning Debt detected in DBMS Functional Dependency & Normalization.',
    type: 'Critical',
    timestamp: '10 mins ago',
    isRead: false,
    actionUrl: '/student/learning-debt',
  },
  {
    id: 'notif-2',
    targetRole: 'teacher',
    title: 'Student Intervention Required',
    message: 'Arun Kumar requires pedagogical intervention for Normalization (35% mastery).',
    type: 'Warning',
    timestamp: '1 hour ago',
    isRead: false,
    actionUrl: '/teacher/interventions',
  },
  {
    id: 'notif-3',
    targetRole: 'parent',
    title: 'Prerequisite Insight Update',
    message: 'Your child (Arun Kumar) is currently experiencing difficulty with DBMS Normalization fundamentals.',
    type: 'Warning',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '/parent/dashboard',
  },
  {
    id: 'notif-4',
    targetRole: 'student',
    title: 'Learning Debt Reduction',
    message: 'Great job! Your Learning Debt reduced from 52 → 44 after completing the Recover Quiz.',
    type: 'Improvement',
    timestamp: 'Yesterday',
    isRead: true,
  },
];

export const notificationService = {
  getNotificationsByRole: (role: UserRole): NotificationItem[] => {
    return INITIAL_NOTIFICATIONS.filter((n) => n.targetRole === role || n.targetRole === 'student');
  },
  markAsRead: (id: string) => {
    const item = INITIAL_NOTIFICATIONS.find((n) => n.id === id);
    if (item) item.isRead = true;
    return INITIAL_NOTIFICATIONS;
  },
};
