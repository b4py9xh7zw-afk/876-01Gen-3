import { useState } from 'react';
import { useExamStore } from '../../store/examStore';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../mock/data';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { BarChart3, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-react';

export default function StudentScores() {
  const { user } = useAuthStore();
  const { scores, exams, getQuestionById } = useExamStore();
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);

  const myScores = user
    ? scores.filter((s) => s.userId === user.id)
    : [];

  const selectedScore = scores.find((s) => s.id === selectedScoreId);
  const selectedExam = exams.find((e) => e.id === selectedScore?.examId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">考试总数</p>
              <p className="text-xl font-bold text-gray-800">{myScores.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">通过数</p>
              <p className="text-xl font-bold text-green-600">
                {myScores.filter((s) => s.isPassed).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">未通过</p>
              <p className="text-xl font-bold text-red-600">
                {myScores.filter((s) => !s.isPassed).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均分</p>
              <p className="text-xl font-bold text-gray-800">
                {myScores.length > 0
                  ? (myScores.reduce((sum, s) => sum + s.totalScore, 0) / myScores.length).toFixed(1)
                  : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">我的成绩</h3>
          <div className="space-y-3">
            {myScores.map((score) => {
              const exam = exams.find((e) => e.id === score.examId);
              const isSelected = score.id === selectedScoreId;
              return (
                <div
                  key={score.id}
                  onClick={() => setSelectedScoreId(score.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                      {exam?.title}
                    </h4>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-bold ${
                        score.isPassed ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {score.totalScore}
                    </span>
                    <StatusBadge status={score.isPassed ? 'passed' : 'failed'} type="pass" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(exam?.startTime || '').toLocaleDateString('zh-CN')}
                  </p>
                </div>
              );
            })}

            {myScores.length === 0 && (
              <div className="p-12 text-center">
                <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">暂无成绩记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          {selectedScore && selectedExam ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 text-lg">{selectedExam.title}</h3>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">总分</p>
                    <p className="text-xl font-bold text-gray-800">{selectedExam.totalScore}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">客观题</p>
                    <p className="text-xl font-bold text-blue-600">{selectedScore.objectiveScore}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600">主观题</p>
                    <p className="text-xl font-bold text-orange-600">{selectedScore.subjectiveScore}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">及格线</p>
                    <p className="text-xl font-bold text-gray-600">{selectedExam.passScore}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-medium text-gray-800 mb-4">答题详情</h4>
                <div className="space-y-3">
                  {selectedScore.answers.map((answer, index) => {
                    const question = getQuestionById(answer.questionId);
                    return (
                      <div
                        key={answer.id}
                        className={`p-4 border rounded-lg ${
                          answer.isCorrect
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-red-200 bg-red-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              第 {index + 1} 题
                            </span>
                            <StatusBadge status={question?.type || ''} type="question" />
                            <span className="text-xs text-gray-500">
                              {question?.score}分
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {answer.isCorrect ? (
                              <>
                                <CheckCircle size={16} className="text-green-500" />
                                <span className="text-sm text-green-600 font-medium">
                                  +{answer.score}分
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle size={16} className="text-red-500" />
                                <span className="text-sm text-red-600 font-medium">
                                  {answer.score}分
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm mb-3">{question?.content}</p>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="text-gray-500">您的答案：</span>
                            <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {answer.userAnswer || '（未作答）'}
                            </span>
                          </p>
                          {!answer.isCorrect && (
                            <p>
                              <span className="text-gray-500">正确答案：</span>
                              <span className="text-green-600">{question?.answer}</span>
                            </p>
                          )}
                          {answer.teacherComment && (
                            <p className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
                              <span className="font-medium">老师评语：</span>
                              {answer.teacherComment}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center h-full">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">请选择左侧成绩查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
