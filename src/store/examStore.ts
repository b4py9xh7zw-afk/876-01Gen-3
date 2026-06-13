import { create } from 'zustand';
import type { Exam, ExamParticipant, QuestionBank, Question, Score, WeakPoint, TrainingRecord } from '../types';
import { mockExams, mockParticipants, mockQuestionBanks, mockQuestions, mockScores, mockWeakPoints, mockTrainingRecords, mockUsers } from '../mock/data';

interface ExamState {
  exams: Exam[];
  participants: ExamParticipant[];
  questionBanks: QuestionBank[];
  questions: Question[];
  scores: Score[];
  weakPoints: WeakPoint[];
  trainingRecords: TrainingRecord[];
  currentExam: Exam | null;
  currentQuestions: Question[];
  currentAnswers: Record<string, string>;
  getExams: () => Exam[];
  getExamById: (id: string) => Exam | undefined;
  getQuestionBanks: () => QuestionBank[];
  getQuestionsByBankId: (bankId: string) => Question[];
  getQuestionById: (id: string) => Question | undefined;
  getScores: () => Score[];
  getScoreById: (id: string) => Score | undefined;
  getScoresByExamId: (examId: string) => Score[];
  getScoresByUserId: (userId: string) => Score[];
  getParticipantsByExamId: (examId: string) => ExamParticipant[];
  getWeakPoints: () => WeakPoint[];
  getTrainingRecordsByUserId: (userId: string) => TrainingRecord[];
  setCurrentExam: (exam: Exam | null) => void;
  setCurrentAnswers: (answers: Record<string, string>) => void;
  submitExam: (examId: string, userId: string, answers: Record<string, string>) => Score;
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  updateScoreReview: (scoreId: string, subjectiveScores: Record<string, number>, comments: Record<string, string>) => void;
  getAbsentList: () => Array<{ user: typeof mockUsers[0]; exam: Exam; participant: ExamParticipant }>;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: mockExams,
  participants: mockParticipants,
  questionBanks: mockQuestionBanks,
  questions: mockQuestions,
  scores: mockScores,
  weakPoints: mockWeakPoints,
  trainingRecords: mockTrainingRecords,
  currentExam: null,
  currentQuestions: [],
  currentAnswers: {},

  getExams: () => get().exams,
  getExamById: (id) => get().exams.find((e) => e.id === id),
  getQuestionBanks: () => get().questionBanks,
  getQuestionsByBankId: (bankId) => get().questions.filter((q) => q.bankId === bankId),
  getQuestionById: (id) => get().questions.find((q) => q.id === id),
  getScores: () => get().scores,
  getScoreById: (id) => get().scores.find((s) => s.id === id),
  getScoresByExamId: (examId) => get().scores.filter((s) => s.examId === examId),
  getScoresByUserId: (userId) => get().scores.filter((s) => s.userId === userId),
  getParticipantsByExamId: (examId) => get().participants.filter((p) => p.examId === examId),
  getWeakPoints: () => get().weakPoints,
  getTrainingRecordsByUserId: (userId) => get().trainingRecords.filter((t) => t.userId === userId),

  setCurrentExam: (exam) => {
    if (exam) {
      const questions = get().questions.filter((q) => exam.questionIds.includes(q.id));
      set({ currentExam: exam, currentQuestions: questions, currentAnswers: {} });
    } else {
      set({ currentExam: null, currentQuestions: [], currentAnswers: {} });
    }
  },

  setCurrentAnswers: (answers) => set({ currentAnswers: answers }),

  submitExam: (examId, userId, answers) => {
    const exam = get().getExamById(examId);
    const questions = get().questions.filter((q) => exam?.questionIds.includes(q.id));
    
    let objectiveScore = 0;
    let subjectiveScore = 0;
    const answerRecords = questions.map((q) => {
      const userAnswer = answers[q.id] || '';
      let isCorrect = false;
      let score = 0;

      if (q.type === 'subjective') {
        isCorrect = false;
        score = 0;
      } else if (q.type === 'single' || q.type === 'judge') {
        isCorrect = userAnswer === q.answer;
        score = isCorrect ? q.score : 0;
        objectiveScore += score;
      } else if (q.type === 'multiple') {
        const userOptions = userAnswer.split(',').sort().join(',');
        const correctOptions = q.answer.split(',').sort().join(',');
        isCorrect = userOptions === correctOptions;
        score = isCorrect ? q.score : 0;
        objectiveScore += score;
      }

      return {
        id: `a_${Date.now()}_${q.id}`,
        questionId: q.id,
        userAnswer,
        isCorrect,
        score,
      };
    });

    const totalScore = objectiveScore + subjectiveScore;
    const isPassed = totalScore >= (exam?.passScore || 60);

    const newScore: Score = {
      id: `score_${Date.now()}`,
      examId,
      userId,
      objectiveScore,
      subjectiveScore,
      totalScore,
      isPassed,
      answers: answerRecords,
    };

    set((state) => ({
      scores: [...state.scores, newScore],
      participants: state.participants.map((p) =>
        p.examId === examId && p.userId === userId
          ? { ...p, status: 'submitted' as const, submitTime: new Date().toISOString() }
          : p
      ),
    }));

    return newScore;
  },

  addExam: (examData) => {
    const newExamId = `exam_${Date.now()}`;
    const newExam: Exam = {
      ...examData,
      id: newExamId,
      createdAt: new Date().toISOString(),
    };
    const targetUsers = mockUsers.filter(
      (u) =>
        u.role === 'student' &&
        u.department === examData.department &&
        u.position === examData.positionType
    );
    const newParticipants: ExamParticipant[] = targetUsers.map((u, idx) => ({
      id: `p_${newExamId}_${u.id}_${idx}`,
      examId: newExamId,
      userId: u.id,
      status: 'pending' as const,
      isMakeup: false,
    }));
    set((state) => ({
      exams: [...state.exams, newExam],
      participants: [...state.participants, ...newParticipants],
    }));
  },

  updateScoreReview: (scoreId, subjectiveScores, comments) => {
    set((state) => {
      let totalSubjective = 0;
      const updatedScores = state.scores.map((s) => {
        if (s.id === scoreId) {
          const updatedAnswers = s.answers.map((a) => {
            const newScore = subjectiveScores[a.questionId] ?? a.score;
            const comment = comments[a.questionId];
            if (comment !== undefined) {
              totalSubjective += newScore;
              return { ...a, score: newScore, teacherComment: comment, isCorrect: newScore > 0 };
            }
            return a;
          });
          const total = s.objectiveScore + totalSubjective;
          const exam = state.exams.find((e) => e.id === s.examId);
          return {
            ...s,
            answers: updatedAnswers,
            subjectiveScore: totalSubjective,
            totalScore: total,
            isPassed: total >= (exam?.passScore || 60),
            reviewedBy: 'teacher1',
            reviewedAt: new Date().toISOString(),
          };
        }
        return s;
      });
      return { scores: updatedScores };
    });
  },

  getAbsentList: () => {
    const { participants, exams } = get();
    return participants
      .filter((p) => p.status === 'absent')
      .map((p) => {
        const user = mockUsers.find((u) => u.id === p.userId);
        const exam = exams.find((e) => e.id === p.examId);
        return { user: user!, exam: exam!, participant: p };
      })
      .filter((item) => item.user && item.exam);
  },
}));
