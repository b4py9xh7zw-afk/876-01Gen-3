import { useAuthStore } from '../../store/authStore';
import { useExamStore } from '../../store/examStore';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import {
  ClipboardList,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function TrainingProfile() {
  const { user } = useAuthStore();
  const { getTrainingRecordsByUserId } = useExamStore();

  const records = user ? getTrainingRecordsByUserId(user.id) : [];

  const totalCredits = records.reduce((sum, r) => sum + r.credits, 0);
  const completedCount = records.filter((r) => r.status === 'completed').length;
  const passRate = records.length > 0 ? ((completedCount / records.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
              <Award size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-blue-200 mt-1">
                {user?.department} ·{' '}
                {user?.position === 'doctor'
                  ? '医师'
                  : user?.position === 'nurse'
                  ? '护士'
                  : '技师'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">累计培训学分</p>
            <p className="text-4xl font-bold">{totalCredits}</p>
            <p className="text-blue-200 text-sm mt-1">学分</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">考试总数</p>
              <p className="text-xl font-bold text-gray-800">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">通过数</p>
              <p className="text-xl font-bold text-green-600">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">通过率</p>
              <p className="text-xl font-bold text-orange-600">{passRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClipboardList size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">年度目标</p>
              <p className="text-xl font-bold text-purple-600">12学分</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">培训档案记录</h3>
          <p className="text-sm text-gray-500 mt-1">历史考试与培训记录</p>
        </div>
        <div className="divide-y divide-gray-100">
          {records.map((record) => (
            <div key={record.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      record.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : record.status === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{record.examTitle}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {record.completedAt
                          ? new Date(record.completedAt).toLocaleDateString('zh-CN')
                          : '进行中'}
                      </span>
                      <StatusBadge
                        status={
                          record.status === 'completed'
                            ? 'completed'
                            : record.status === 'failed'
                            ? 'failed_record'
                            : 'pending_record'
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {record.credits > 0 ? `+${record.credits}` : '0'}
                    <span className="text-sm font-normal text-gray-500 ml-1">学分</span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="p-12 text-center">
              <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无培训档案记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
