import { useExamStore } from '../../store/examStore';
import { mockUsers } from '../../mock/data';
import { ClipboardList, Users, Award, TrendingUp } from 'lucide-react';

export default function TrainingOverview() {
  const { scores, exams } = useExamStore();

  const departments = ['内科', '外科', '检验科', '护理部', '院部'];

  const departmentStats = departments.map((dept) => {
    const deptUsers = mockUsers.filter((u) => u.department === dept);
    const deptScores = scores.filter((s) => {
      const user = mockUsers.find((u) => u.id === s.userId);
      return user?.department === dept;
    });
    const passCount = deptScores.filter((s) => s.isPassed).length;
    const avgScore =
      deptScores.length > 0
        ? deptScores.reduce((sum, s) => sum + s.totalScore, 0) / deptScores.length
        : 0;

    return {
      department: dept,
      userCount: deptUsers.length,
      examCount: deptScores.length,
      passRate: deptScores.length > 0 ? ((passCount / deptScores.length) * 100).toFixed(1) : '0',
      avgScore: avgScore.toFixed(1),
    };
  });

  const totalCredits = scores.filter((s) => s.isPassed).length * 2;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">培训人员</p>
              <p className="text-2xl font-bold text-gray-800">
                {mockUsers.filter((u) => u.role === 'student').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ClipboardList size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">考试场次</p>
              <p className="text-2xl font-bold text-gray-800">{exams.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">累计学分</p>
              <p className="text-2xl font-bold text-orange-600">{totalCredits}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总通过率</p>
              <p className="text-2xl font-bold text-purple-600">
                {scores.length > 0
                  ? (
                      (scores.filter((s) => s.isPassed).length / scores.length) *
                      100
                    ).toFixed(1)
                  : '0'}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">各科室培训档案统计</h3>
          <p className="text-sm text-gray-500 mt-1">按科室维度查看培训完成情况</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                科室
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                人员数
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                考试人次
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                通过率
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                平均分
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                状态
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departmentStats.map((dept) => {
              const isGood = parseFloat(dept.passRate) >= 80;
              const isWarning = parseFloat(dept.passRate) >= 60 && parseFloat(dept.passRate) < 80;
              return (
                <tr key={dept.department} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{dept.department}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-700">{dept.userCount} 人</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-700">{dept.examCount} 次</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-semibold ${
                        isGood
                          ? 'text-green-600'
                          : isWarning
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {dept.passRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-700">{dept.avgScore} 分</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isGood
                          ? 'bg-green-100 text-green-700'
                          : isWarning
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isGood ? '达标' : isWarning ? '待提升' : '需关注'}
                    </span>
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
