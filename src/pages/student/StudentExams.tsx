import { useExamStore } from '../../store/examStore';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { FileText, Clock, Calendar, Play, AlertTriangle, Ban, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function StudentExams() {
  const { user } = useAuthStore();
  const { exams, participants, getParticipantsByExamId } = useExamStore();
  const navigate = useNavigate();
  const [timeBlockMsg, setTimeBlockMsg] = useState<string | null>(null);

  const myParticipants = user ? participants.filter((p) => p.userId === user.id) : [];

  const myExams = myParticipants
    .map((p) => {
      const exam = exams.find((e) => e.id === p.examId);
      return exam ? { exam, participant: p } : null;
    })
    .filter(Boolean) as Array<{ exam: typeof exams[0]; participant: typeof myParticipants[0] }>;

  const pendingExams = myExams.filter((e) => e.participant.status === 'pending');
  const completedExams = myExams.filter((e) => e.participant.status === 'submitted');
  const makeupExams = myExams.filter((e) => e.participant.isMakeup);

  const checkExamTimeWindow = (exam: typeof exams[0]): { allowed: boolean; reason?: string } => {
    const now = Date.now();
    const start = new Date(exam.startTime).getTime();
    const end = new Date(exam.endTime).getTime();
    if (now < start) {
      return {
        allowed: false,
        reason: `考试尚未开始，请于 ${new Date(start).toLocaleString('zh-CN')} 后进入`,
      };
    }
    if (now > end) {
      return { allowed: false, reason: '考试已结束，无法进入' };
    }
    return { allowed: true };
  };

  const handleStartExam = (exam: typeof exams[0]) => {
    const check = checkExamTimeWindow(exam);
    if (!check.allowed) {
      setTimeBlockMsg(check.reason || '当前不在考试时间范围内');
      setTimeout(() => setTimeBlockMsg(null), 4000);
      return;
    }
    navigate(`/student/exam/${exam.id}`);
  };

  const getExamTimeStatus = (exam: typeof exams[0]): 'not_started' | 'ongoing' | 'ended' => {
    const now = Date.now();
    const start = new Date(exam.startTime).getTime();
    const end = new Date(exam.endTime).getTime();
    if (now < start) return 'not_started';
    if (now > end) return 'ended';
    return 'ongoing';
  };

  return (
    <div className="space-y-6">
      {timeBlockMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.3s]">
          <div className="flex items-center gap-2.5 px-5 py-3 bg-red-50 border border-red-200 rounded-xl shadow-lg">
            <Ban size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{timeBlockMsg}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-blue-100 text-sm mb-1">待参加考试</p>
          <p className="text-3xl font-bold">{pendingExams.length}</p>
          <p className="text-xs text-blue-200 mt-2">场考试待参加</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <p className="text-green-100 text-sm mb-1">已完成考试</p>
          <p className="text-3xl font-bold">{completedExams.length}</p>
          <p className="text-xs text-green-200 mt-2">场考试已完成</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <p className="text-orange-100 text-sm mb-1">补考通知</p>
          <p className="text-3xl font-bold">{makeupExams.length}</p>
          <p className="text-xs text-orange-200 mt-2">场需要补考</p>
        </div>
      </div>

      {pendingExams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">待参加考试</h3>
          <div className="grid grid-cols-2 gap-4">
            {pendingExams.map(({ exam, participant }) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{exam.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={exam.positionType} type="position" />
                        {participant.isMakeup && <StatusBadge status="makeup" />}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={exam.status} />
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{exam.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>
                      {new Date(exam.startTime).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>考试时长：{exam.duration}分钟</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">满分 </span>
                    <span className="font-medium text-gray-800">{exam.totalScore}分</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-gray-500">及格线 </span>
                    <span className="font-medium text-orange-600">{exam.passScore}分</span>
                  </div>
                  {(() => {
                    const ts = getExamTimeStatus(exam);
                    if (ts === 'not_started') {
                      return (
                        <button
                          disabled
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          <Timer size={16} />
                          未开始
                        </button>
                      );
                    }
                    if (ts === 'ended') {
                      return (
                        <button
                          disabled
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          <Ban size={16} />
                          已结束
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Play size={16} />
                        开始考试
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {makeupExams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            补考通知
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {makeupExams.map(({ exam, participant }) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl border-2 border-orange-300 p-5 bg-orange-50/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{exam.title}</h4>
                      <StatusBadge status="makeup" />
                    </div>
                  </div>
                  <StatusBadge status={exam.status} />
                </div>

                <p className="text-sm text-orange-700 bg-orange-100 px-3 py-2 rounded-lg mb-4">
                  您上次考试未参加，请按时参加补考
                </p>

                <div className="flex items-center justify-between">
                  {(() => {
                    const ts = getExamTimeStatus(exam);
                    if (ts === 'not_started') {
                      return (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Timer size={14} />
                          考试未开始
                        </p>
                      );
                    }
                    if (ts === 'ended') {
                      return (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <Ban size={14} />
                          考试已结束
                        </p>
                      );
                    }
                    return <div />;
                  })()}
                  {(() => {
                    const ts = getExamTimeStatus(exam);
                    const disabled = ts !== 'ongoing';
                    return (
                      <button
                        onClick={() => !disabled && handleStartExam(exam)}
                        disabled={disabled}
                        className={
                          disabled
                            ? 'flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium'
                            : 'flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium'
                        }
                      >
                        <Play size={16} />
                        参加补考
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedExams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">已完成考试</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    考试名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    科室
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    考试时间
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    状态
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {completedExams.map(({ exam, participant }) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{exam.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{exam.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {new Date(exam.startTime).toLocaleDateString('zh-CN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status="submitted" type="participant" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate('/student/scores')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        查看成绩
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {myExams.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">暂无考试安排</p>
        </div>
      )}
    </div>
  );
}
