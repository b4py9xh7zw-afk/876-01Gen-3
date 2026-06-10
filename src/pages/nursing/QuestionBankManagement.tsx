import { useExamStore } from '../../store/examStore';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, FileQuestion } from 'lucide-react';

export default function QuestionBankManagement() {
  const { questionBanks, questions, getQuestionsByBankId } = useExamStore();
  const [activeTab, setActiveTab] = useState<'doctor' | 'nurse' | 'technician'>('doctor');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const filteredBanks = questionBanks.filter((b) => b.positionType === activeTab);
  const selectedBank = questionBanks.find((b) => b.id === selectedBankId);
  const bankQuestions = selectedBankId ? getQuestionsByBankId(selectedBankId) : [];

  const tabConfig = [
    { key: 'doctor', label: '医师题库', count: questionBanks.filter(b => b.positionType === 'doctor').reduce((s, b) => s + b.questionCount, 0) },
    { key: 'nurse', label: '护理题库', count: questionBanks.filter(b => b.positionType === 'nurse').reduce((s, b) => s + b.questionCount, 0) },
    { key: 'technician', label: '技师题库', count: questionBanks.filter(b => b.positionType === 'technician').reduce((s, b) => s + b.questionCount, 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          新增题目
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredBanks.map((bank) => (
          <div
            key={bank.id}
            onClick={() => setSelectedBankId(bank.id)}
            className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedBankId === bank.id
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                activeTab === 'doctor' ? 'bg-blue-100 text-blue-600' :
                activeTab === 'nurse' ? 'bg-pink-100 text-pink-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <BookOpen size={24} />
              </div>
              <StatusBadge status={bank.positionType} type="position" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{bank.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{bank.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <FileQuestion size={14} className="inline mr-1" />
                {bank.questionCount} 题
              </span>
              <span className="text-blue-600 hover:text-blue-700">查看 →</span>
            </div>
          </div>
        ))}
      </div>

      {selectedBank && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedBank.name}</h3>
              <p className="text-sm text-gray-500 mt-1">共 {bankQuestions.length} 道题目</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                题库设置
              </button>
              <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                + 添加题目
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {bankQuestions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                      <StatusBadge status={question.type} type="question" />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {question.knowledgePoint}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {question.score}分
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">{question.content}</p>
                    {question.options && (
                      <div className="mt-3 space-y-1.5">
                        {question.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-medium">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">正确答案：</span>
                      <span className="text-xs font-medium text-green-600">{question.answer}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
