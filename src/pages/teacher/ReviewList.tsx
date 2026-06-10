import { useExamStore } from '../../store/examStore';
import { mockUsers } from '../../mock/data';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ClipboardList, FileText, User, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherReviewList() {
  const { scores, exams, getQuestionsByBankId } = useExamStore();
  const navigate = useNavigate();

  const pendingReviews = scores.filter(
    (s) => !s.reviewedAt && s.answers.some((a) => !a.isCorrect && a.score === 0 && a.userAnswer)
  );

  const examsWithPending = exams.filter((exam) =>
    scores.some(
      (s) =>
        s.examId === exam.id &&
        !s.reviewedAt &&
        s.answers.some((a) => !a.isCorrect && a.score === 0 && a.userAnswer)
    )
  );

  const getPendingCount = (examId: string) => {
    return scores.filter(
      (s) =>
        s.examId === examId &&
        !s.reviewedAt &&
        s.answers.some((a) => !a.isCorrect && a.score === 0 && a.userAnswer)
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClipboardList size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待批阅试卷</p>
              <p className="text-2xl font-bold text-gray-800">{pendingReviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">涉及考试</p>
              <p className="text-2xl font-bold text-gray-800">{examsWithPending.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已批阅</p>
              <p className="text-2xl font-bold text-gray-800">
                {scores.filter((s) => s.reviewedAt).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日批阅</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">待批阅考试列表</h3>
          <p className="text-sm text-gray-500 mt-1">点击进入批阅页面</p>
        </div>
        <div className="divide-y divide-gray-100">
          {examsWithPending.map((exam) => (
            <div
              key={exam.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/teacher/review/${exam.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{exam.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{exam.department}</span>
                      <StatusBadge status={exam.positionType} type="position" />
                      <span className="text-xs text-gray-500">
                        {new Date(exam.startTime).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {getPendingCount(exam.id)} 份待批阅
                    </p>
                    <p className="text-xs text-gray-500">
                      主观题待评分
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}

          {examsWithPending.length === 0 && (
            <div className="p-12 text-center">
              <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无待批阅试卷</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
