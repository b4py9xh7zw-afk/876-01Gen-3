import { useExamStore } from '@/store/examStore';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/mock/data';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { Search, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function TeacherScores() {
  const { user } = useAuthStore();
  const { scores, exams } = useExamStore();
  const [search, setSearch] = useState('');

  const deptScores = scores.filter((s) => {
    const scoreUser = mockUsers.find((u) => u.id === s.userId);
    return scoreUser?.department === user?.department;
  });

  const filteredScores = deptScores.filter((s) => {
    const scoreUser = mockUsers.find((u) => u.id === s.userId);
    const exam = exams.find((e) => e.id === s.examId);
    return (
      scoreUser?.name.includes(search) || exam?.title.includes(search)
    );
  });

  const stats = {
    total: deptScores.length,
    passed: deptScores.filter((s) => s.isPassed).length,
    avg:
      deptScores.length > 0
        ? (deptScores.reduce((sum, s) => sum + s.totalScore, 0) / deptScores.length).toFixed(1)
        : '0',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">考试人次</p>
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">通过人数</p>
              <p className="text-xl font-bold text-green-600">{stats.passed}</p>
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
              <p className="text-xl font-bold text-orange-600">{stats.avg}</p>
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
            placeholder="搜索姓名或考试..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            {user?.department} 成绩列表
          </h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                姓名
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
              const scoreUser = mockUsers.find((u) => u.id === score.userId);
              const exam = exams.find((e) => e.id === score.examId);
              return (
                <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {scoreUser?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={scoreUser?.position || ''} type="position" />
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
                    <StatusBadge
                      status={score.isPassed ? 'passed' : 'failed'}
                      type="pass"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredScores.length === 0 && (
          <div className="p-12 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无成绩记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
