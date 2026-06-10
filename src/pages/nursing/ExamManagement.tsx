import { useExamStore } from '../../store/examStore';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ExamManagement() {
  const { exams, addExam, getQuestionBanks } = useExamStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    department: string;
    positionType: 'doctor' | 'nurse' | 'technician';
    bankId: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalScore: number;
    passScore: number;
  }>({
    title: '',
    department: '',
    positionType: 'doctor',
    bankId: '',
    startTime: '',
    endTime: '',
    duration: 120,
    totalScore: 100,
    passScore: 60,
  });

  const filteredExams = exams.filter((e) =>
    e.title.includes(search) || e.department.includes(search)
  );

  const questionBanks = getQuestionBanks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bank = questionBanks.find((b) => b.id === formData.bankId);
    const questions = useExamStore.getState().getQuestionsByBankId(formData.bankId);
    const questionIds = questions.slice(0, 10).map((q) => q.id);
    
    addExam({
      ...formData,
      status: 'pending',
      questionIds,
      createdBy: 'nursing1',
    });
    setShowModal(false);
    setFormData({
      title: '',
      department: '',
      positionType: 'doctor',
      bankId: '',
      startTime: '',
      endTime: '',
      duration: 120,
      totalScore: 100,
      passScore: 60,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索考试名称或科室..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          发布考试
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                考试名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                科室
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                岗位
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                考试时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                时长/分值
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">题库：{questionBanks.find(b => b.id === exam.bankId)?.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{exam.department}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={exam.positionType} type="position" />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{new Date(exam.startTime).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(exam.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(exam.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">{exam.duration}分钟</p>
                  <p className="text-xs text-gray-500">满分 {exam.totalScore} 分</p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={exam.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">发布新考试</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">考试名称</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">科室</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">岗位类型</label>
                  <select
                    value={formData.positionType}
                    onChange={(e) => setFormData({ ...formData, positionType: e.target.value as 'doctor' | 'nurse' | 'technician' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="doctor">医生</option>
                    <option value="nurse">护士</option>
                    <option value="technician">技师</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">选择题库</label>
                <select
                  value={formData.bankId}
                  onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">请选择题库</option>
                  {questionBanks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}（{bank.questionCount}题）
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">开始时间</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">结束时间</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">考试时长(分钟)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">总分</label>
                  <input
                    type="number"
                    value={formData.totalScore}
                    onChange={(e) => setFormData({ ...formData, totalScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">及格分</label>
                  <input
                    type="number"
                    value={formData.passScore}
                    onChange={(e) => setFormData({ ...formData, passScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  发布考试
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
