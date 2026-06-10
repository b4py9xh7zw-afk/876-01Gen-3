import { useExamStore } from '../../store/examStore';
import { mockUsers } from '../../mock/data';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { User, Calendar, Clock, RotateCcw, Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function MakeupManagement() {
  const { getAbsentList, exams } = useExamStore();
  const [showMakeupModal, setShowMakeupModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [makeupTime, setMakeupTime] = useState('');

  const absentList = getAbsentList();

  const handleCreateMakeup = (examId: string) => {
    setSelectedExamId(examId);
    setShowMakeupModal(true);
  };

  const handleSubmitMakeup = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMakeupModal(false);
    setSelectedExamId('');
    setMakeupTime('');
  };

  const groupedAbsent = absentList.reduce((acc, item) => {
    if (!acc[item.exam.id]) {
      acc[item.exam.id] = { exam: item.exam, users: [] };
    }
    acc[item.exam.id].users.push(item.user);
    return acc;
  }, {} as Record<string, { exam: typeof exams[0]; users: typeof mockUsers }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">补考管理</h2>
            <p className="text-sm text-gray-500">共 {absentList.length} 人缺考，需安排补考</p>
          </div>
        </div>
        <button
          onClick={() => setShowMakeupModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={18} />
          安排补考
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">缺考总人次</p>
          <p className="text-3xl font-bold text-red-600">{absentList.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">涉及考试数</p>
          <p className="text-3xl font-bold text-orange-600">{Object.keys(groupedAbsent).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">已安排补考</p>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">补考完成</p>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.values(groupedAbsent).map(({ exam, users }) => (
          <div key={exam.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  <Calendar size={14} className="inline mr-1" />
                  {new Date(exam.startTime).toLocaleDateString('zh-CN')}
                  <Clock size={14} className="inline ml-3 mr-1" />
                  {exam.duration}分钟
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  缺考 <span className="font-semibold text-red-600">{users.length}</span> 人
                </span>
                <button
                  onClick={() => handleCreateMakeup(exam.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  安排补考
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.department}</p>
                    </div>
                    <StatusBadge status="absent" type="participant" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {Object.keys(groupedAbsent).length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <RotateCcw size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无缺考人员</p>
          </div>
        )}
      </div>

      {showMakeupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">安排补考</h3>
            <form onSubmit={handleSubmitMakeup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">选择考试</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">请选择考试</option>
                  {Object.values(groupedAbsent).map(({ exam }) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">补考时间</label>
                <input
                  type="datetime-local"
                  value={makeupTime}
                  onChange={(e) => setMakeupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMakeupModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  确认安排
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
