import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../../store/examStore';
import { useAuthStore } from '../../store/authStore';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getExamById,
    getQuestionById,
    submitExam,
  } = useExamStore();

  const exam = getExamById(examId || '');
  const questions = exam?.questionIds
    .map((id) => getQuestionById(id))
    .filter(Boolean) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam?.duration ? exam.duration * 60 : 0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSingleSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionLetter }));
  };

  const handleMultipleSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    const optionLetter = String.fromCharCode(65 + optionIndex);
    const currentAnswer = answers[currentQuestion.id] || '';
    const selected = currentAnswer.split(',').filter(Boolean);
    const newSelected = selected.includes(optionLetter)
      ? selected.filter((o) => o !== optionLetter)
      : [...selected, optionLetter];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: newSelected.sort().join(','),
    }));
  };

  const handleJudgeSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubjectiveChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubmit = () => {
    if (!exam || !user) return;
    const result = submitExam(exam.id, user.id, answers);
    setSubmitted(true);
    navigate('/student/scores');
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (!exam || !currentQuestion) {
    return (
      <div className="p-6">
            <p className="text-gray-500">考试不存在</p>
          </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">试卷已提交</h3>
          <p className="text-gray-500 mb-6">您的答案已成功提交，请等待批阅</p>
          <button
            onClick={() => navigate('/student/scores')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看成绩
          </button>
        </div>
      </div>
    );
  }

  const isFiveMinutesLeft = timeLeft <= 300;

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{exam.title}</h2>
            <p className="text-sm text-gray-500">
              共 {questions.length} 题 · 满分 {exam.totalScore} 分
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isFiveMinutesLeft
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-blue-100 text-blue-600'
          }`}
          >
            <Clock size={20} />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          已答 {answeredCount}/{questions.length} 题
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-3">答题卡</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q?.id || ''];
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={q?.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isAnswered
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>已答</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>未答</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <span className="text-sm text-blue-600 font-medium">
                第 {currentIndex + 1} 题 · {currentQuestion.score}分
              </span>
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {currentQuestion.type === 'single' && '单选题'}
                {currentQuestion.type === 'multiple' && '多选题'}
                {currentQuestion.type === 'judge' && '判断题'}
                {currentQuestion.type === 'subjective' && '主观题'}
              </span>
              <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                {currentQuestion.knowledgePoint}
              </span>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-6">
              {currentQuestion.content}
            </h3>

            {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple') &&
              currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected =
                      currentQuestion.type === 'single'
                        ? answers[currentQuestion.id] === optionLetter
                        : (answers[currentQuestion.id] || '')
                            .split(',')
                            .includes(optionLetter);

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          currentQuestion.type === 'single'
                            ? handleSingleSelect(index)
                            : handleMultipleSelect(index)
                        }
                        className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {optionLetter}
                          </span>
                          <span className="text-gray-800">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {currentQuestion.type === 'judge' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleJudgeSelect('对')}
                  className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                    answers[currentQuestion.id] === '对'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === '对'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                    >
                      ✓
                    </div>
                    <span className="font-medium text-gray-800">正确</span>
                  </div>
                </button>
                <button
                  onClick={() => handleJudgeSelect('错')}
                  className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                    answers[currentQuestion.id] === '错'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === '错'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      ✕
                    </div>
                    <span className="font-medium text-gray-800">错误</span>
                  </div>
                </button>
              </div>
            )}

            {currentQuestion.type === 'subjective' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSubjectiveChange(e.target.value)}
                  placeholder="请输入您的答案..."
                  rows={10}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  请认真作答，主观题将由老师批阅
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            上一题
          </button>

          <div className="text-sm text-gray-500">
            第 {currentIndex + 1} / {questions.length} 题
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() =>
            setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
              }
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              下一题
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send size={18} />
              交卷
            </button>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">确认交卷</h3>
                <p className="text-sm text-gray-500">交卷后无法修改答案</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">题目总数</span>
                <span className="font-medium">{questions.length} 题</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">已答题目</span>
                <span className="font-medium text-green-600">{answeredCount} 题</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">未答题目</span>
                <span className="font-medium text-red-600">
                  {questions.length - answeredCount} 题
                </span>
              </div>
            </div>

            {questions.length - answeredCount > 0 && (
              <p className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mb-4">
                您还有 {questions.length - answeredCount} 题未作答，确定要交卷吗？
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-3 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
