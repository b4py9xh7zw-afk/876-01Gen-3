import { useExamStore } from '../../store/examStore';
import StatCard from '../../components/StatCard/StatCard';
import {
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Target,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

export default function AdminDashboard() {
  const { exams, scores, participants, weakPoints, getWeakPoints } = useExamStore();

  const totalExams = exams.length;
  const totalParticipants = participants.length;
  const submittedCount = participants.filter((p) => p.status === 'submitted').length;
  const participationRate = totalParticipants > 0 ? ((submittedCount / totalParticipants) * 100).toFixed(1) : '0';
  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length).toFixed(1)
    : '0';
  const passCount = scores.filter((s) => s.isPassed).length;
  const passRate = scores.length > 0 ? ((passCount / scores.length) * 100).toFixed(1) : '0';

  const weakPointsData = getWeakPoints().slice(0, 5);
  const maxWrongRate = Math.max(...weakPointsData.map((w) => w.wrongRate), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="考试总数"
          value={totalExams}
          icon={<FileText size={22} />}
          color="blue"
          subtitle="场考试"
          trend="12%"
          trendUp
        />
        <StatCard
          title="参与人次"
          value={submittedCount}
          icon={<Users size={22} />}
          color="green"
          subtitle={`参与率 ${participationRate}%`}
          trend="8%"
          trendUp
        />
        <StatCard
          title="平均分数"
          value={avgScore}
          icon={<BarChart3 size={22} />}
          color="orange"
          subtitle="满分100分"
          trend="3.2%"
          trendUp
        />
        <StatCard
          title="合格率"
          value={`${passRate}%`}
          icon={<CheckCircle2 size={22} />}
          color="green"
          subtitle={`${passCount}人通过`}
          trend="2.5%"
          trendUp
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">薄弱知识点分析</h3>
            <span className="text-sm text-gray-500">TOP 5</span>
          </div>
          <div className="space-y-4">
            {weakPointsData.map((wp, index) => (
              <div key={wp.knowledgePoint}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 3 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{wp.knowledgePoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {wp.wrongCount}/{wp.totalCount}题
                    </span>
                    <span className="text-sm font-semibold text-red-500">
                      {wp.wrongRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index < 3 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'
                    }`}
                    style={{ width: `${(wp.wrongRate / maxWrongRate) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">近期考试</h3>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 4).map((exam) => (
              <div
                key={exam.id}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {exam.title}
                  </p>
                  <StatusBadge status={exam.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{exam.department}</span>
                  <span>
                    {new Date(exam.startTime).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月考试</p>
              <p className="text-xl font-bold text-gray-800">8 场</p>
            </div>
          </div>
          <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
            较上月增长 25%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待关注科目</p>
              <p className="text-xl font-bold text-gray-800">3 个</p>
            </div>
          </div>
          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">
            错误率超过 50%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">培训达标率</p>
              <p className="text-xl font-bold text-gray-800">86.5%</p>
            </div>
          </div>
          <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
            季度目标达成
          </p>
        </div>
      </div>
    </div>
  );
}
