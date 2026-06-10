import { useExamStore } from '../../store/examStore';
import { AlertTriangle, TrendingDown, BookOpen } from 'lucide-react';

export default function WeakPointsPage() {
  const { getWeakPoints } = useExamStore();
  const weakPoints = getWeakPoints();
  const maxWrongRate = Math.max(...weakPoints.map((w) => w.wrongRate), 1);

  const highRisk = weakPoints.filter((w) => w.wrongRate >= 50);
  const mediumRisk = weakPoints.filter((w) => w.wrongRate >= 30 && w.wrongRate < 50);
  const lowRisk = weakPoints.filter((w) => w.wrongRate < 30);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">高风险知识点</p>
              <p className="text-3xl font-bold">{highRisk.length}</p>
            </div>
            <AlertTriangle size={28} className="text-white/80" />
          </div>
          <p className="text-xs text-red-200 mt-3">错误率 ≥ 50%</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">中风险知识点</p>
              <p className="text-3xl font-bold">{mediumRisk.length}</p>
            </div>
            <TrendingDown size={28} className="text-white/80" />
          </div>
          <p className="text-xs text-orange-200 mt-3">错误率 30%-50%</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">低风险知识点</p>
              <p className="text-3xl font-bold">{lowRisk.length}</p>
            </div>
            <BookOpen size={28} className="text-white/80" />
          </div>
          <p className="text-xs text-green-200 mt-3">错误率 {'<'} 30%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">薄弱知识点排名</h3>
          <span className="text-sm text-gray-500">共 {weakPoints.length} 个知识点</span>
        </div>

        <div className="space-y-4">
          {weakPoints.map((wp, index) => (
            <div
              key={wp.knowledgePoint}
              className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4 mb-3">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? 'bg-red-500 text-white'
                      : index === 1
                      ? 'bg-orange-500 text-white'
                      : index === 2
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{wp.knowledgePoint}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        错误 {wp.wrongCount}/{wp.totalCount} 题
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          wp.wrongRate >= 50
                            ? 'text-red-600'
                            : wp.wrongRate >= 30
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {wp.wrongRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-12">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      wp.wrongRate >= 50
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : wp.wrongRate >= 30
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                        : 'bg-gradient-to-r from-green-400 to-green-500'
                    }`}
                    style={{ width: `${(wp.wrongRate / maxWrongRate) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
