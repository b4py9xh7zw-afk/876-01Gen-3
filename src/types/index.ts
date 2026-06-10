export type UserRole = 'admin' | 'nursing' | 'teacher' | 'student';
export type PositionType = 'doctor' | 'nurse' | 'technician';
export type QuestionType = 'single' | 'multiple' | 'judge' | 'subjective';
export type ExamStatus = 'pending' | 'ongoing' | 'ended' | 'reviewed';
export type ParticipantStatus = 'pending' | 'ongoing' | 'submitted' | 'absent';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  department: string;
  position: PositionType;
  avatar?: string;
}

export interface Question {
  id: string;
  bankId: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string;
  knowledgePoint: string;
  score: number;
}

export interface QuestionBank {
  id: string;
  name: string;
  positionType: PositionType;
  questionCount: number;
  description?: string;
}

export interface Exam {
  id: string;
  title: string;
  department: string;
  positionType: PositionType;
  bankId: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalScore: number;
  passScore: number;
  status: ExamStatus;
  questionIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface ExamParticipant {
  id: string;
  examId: string;
  userId: string;
  status: ParticipantStatus;
  isMakeup: boolean;
  joinTime?: string;
  submitTime?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
  teacherComment?: string;
}

export interface Score {
  id: string;
  examId: string;
  userId: string;
  objectiveScore: number;
  subjectiveScore: number;
  totalScore: number;
  isPassed: boolean;
  answers: Answer[];
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface WeakPoint {
  knowledgePoint: string;
  totalCount: number;
  wrongCount: number;
  wrongRate: number;
}

export interface TrainingRecord {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  credits: number;
  status: 'completed' | 'failed' | 'pending';
  completedAt?: string;
}

export interface DepartmentStats {
  department: string;
  totalExams: number;
  participationRate: number;
  passRate: number;
  avgScore: number;
}
