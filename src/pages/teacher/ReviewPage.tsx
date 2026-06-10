import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/examStore';
import { mockUsers } from '../../mock/data';
import { ArrowLeft, User, ChevronLeft, ChevronRight, Check, MessageSquare } from 'lucide-react';

export default function ReviewPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { scores, getQuestionById, updateScoreReview, getExamById } = useExamStore();

  const exam = getExamById(examId || '');
  
  const pendingScores = scores.filter(
    (s) =>
      s.examId === examId &&
      s.answers.some((a) => !a.isCorrect && a.score === 0 && a.userAnswer && a.teacherComment === undefined)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScore = pendingScores[currentIndex];
  const user = currentScore ? mockUsers.find((u) => u.id === currentScore.userId) : null;

  const subjectiveAnswers = currentScore
    ? currentScore.answers.filter((a) => {
        const q = getQuestionById(a.questionId);
        return q?.type === 'subjective' && a.userAnswer;
      })
    : [];

  const [scoresState, setScoresState] = useState<Record<string, number>>({});
  const [commentsState, setCommentsState] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentSubjectiveAnswer = subjectiveAnswers[currentQuestionIndex];
  const currentQuestion = currentSubjectiveAnswer
    ? getQuestionById(currentSubjectiveAnswer.questionId)
    : null;

  const handleScoreChange = (value: number) => {
    if (currentSubjectiveAnswer) {
      setScoresState((prev) => ({
        ...prev,
        [currentSubjectiveAnswer.questionId]: value,
      }));
    }
  };

  const handleCommentChange = (value: string) => {
    if (currentSubjectiveAnswer) {
      setCommentsState((prev) => ({
        ...prev,
        [currentSubjectiveAnswer.questionId]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (currentScore) {
      updateScoreReview(currentScore.id, scoresState, commentsState);
      if (currentIndex < pendingScores.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestionIndex(0);
        setScoresState({});
        setCommentsState({});
      } else {
        navigate('/teacher/review');
      }
    }
  };

  if (!currentScore || !user || !currentQuestion || !currentSubjectiveAnswer) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/teacher/review')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          返回待批阅列表
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">没有待批阅的试卷</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/teacher/review')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          返回待批阅列表
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            第 {currentIndex + 1} / {pendingScores.length} 份
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">
                {user.department} · {exam?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">客观题得分</p>
              <p className="text-xl font-bold text-blue-600">{currentScore.objectiveScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">主观题得分</p>
              <p className="text-xl font-bold text-orange-600">{currentScore.subjectiveScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">总分</p>
              <p className="text-2xl font-bold text-gray-800">{currentScore.totalScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="font-medium text-gray-800 mb-3">主观题列表</h4>
          <div className="space-y-2">
            {subjectiveAnswers.map((answer, index) => {
              const q = getQuestionById(answer.questionId);
              const isActive = index === currentQuestionIndex;
              const hasScore = scoresState[answer.questionId] !== undefined;
              return (
                <button
                  key={answer.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">第 {index + 1} 题</span>
                    {hasScore ? (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <Check size={12} />
                        {scoresState[answer.questionId]}分
                      </span>
                    ) : (
                      <span className="text-xs text-orange-600">待批阅</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{q?.content}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm text-blue-600 font-medium">
                  第 {currentQuestionIndex + 1} 题 · 主观题 · {currentQuestion.score}分
                </span>
                <h4 className="font-medium text-gray-800 mt-2 text-lg">
                  {currentQuestion.content}
                </h4>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-sm text-gray-500 mb-2">参考答案：</p>
              <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                {currentQuestion.answer}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-500" />
              考生答案
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg min-h-32 text-gray-700">
              {currentSubjectiveAnswer.userAnswer || '（未作答）'}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-800 mb-4">评分与评语</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本题得分（满分 {currentQuestion.score} 分）
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={currentQuestion.score}
                    value={scoresState[currentSubjectiveAnswer.questionId] || 0}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={currentQuestion.score}
                    value={scoresState[currentSubjectiveAnswer.questionId] || 0}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium"
                  />
                  <span className="text-gray-500">/ {currentQuestion.score} 分</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评语（选填）
                </label>
                <textarea
                  value={commentsState[currentSubjectiveAnswer.questionId] || ''}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder="请输入评语..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              上一题
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(subjectiveAnswers.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === subjectiveAnswers.length - 1}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一题
                <ChevronRight size={18} />
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check size={18} />
                提交批阅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
