import { useExamStore } from '../../store/examStore';
import { mockUsers } from '../../mock/data';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Search, Download, Filter, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ScoreManagement() {
  const { scores, exams } = useExamStore();
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('');

  const filteredScores = scores.filter((s) => {
    const user = mockUsers.find((u) => u.id === s.userId);
    const exam = exams.find((e) => e.id === s.examId);
    const matchSearch =
      user?.name.includes(search) || exam?.title.includes(search);
    const matchExam = !examFilter || s.examId === examFilter;
    return matchSearch && matchExam;
  });

  const stats = {
    total: scores.length,
    passed: scores.filter((s) => s.isPassed).length,
    failed: scores.filter((s) => !s.isPassed).length,
    avg: scores.length > 0
      ? (scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">考试总人次</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">通过人数</p>
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">未通过人数</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">平均分数</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avg}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索姓名或考试名称..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">全部考试</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Download size={18} />
          导出成绩
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                科室
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                岗位
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                考试名称
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                客观题
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                主观题
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                总分
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                状态
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredScores.map((score) => {
              const user = mockUsers.find((u) => u.id === score.userId);
              const exam = exams.find((e) => e.id === score.examId);
              return (
                <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{user?.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user?.position || ''} type="position" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{exam?.title}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-700">{score.objectiveScore}分</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-700">{score.subjectiveScore}分</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-lg font-bold ${
                        score.isPassed ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {score.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={score.isPassed ? 'passed' : 'failed'} type="pass" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
