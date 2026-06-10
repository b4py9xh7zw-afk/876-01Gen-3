import { cn } from '../../lib/utils';
import type { ExamStatus, ParticipantStatus, PositionType, QuestionType } from '../../types';

interface StatusBadgeProps {
  status: string;
  type?: 'exam' | 'participant' | 'position' | 'question' | 'pass';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: '未开始', className: 'bg-gray-100 text-gray-600' },
  ongoing: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
  ended: { label: '已结束', className: 'bg-yellow-100 text-yellow-700' },
  reviewed: { label: '已批阅', className: 'bg-green-100 text-green-700' },
  submitted: { label: '已提交', className: 'bg-blue-100 text-blue-700' },
  absent: { label: '缺考', className: 'bg-red-100 text-red-700' },
  doctor: { label: '医生', className: 'bg-blue-100 text-blue-700' },
  nurse: { label: '护士', className: 'bg-pink-100 text-pink-700' },
  technician: { label: '技师', className: 'bg-purple-100 text-purple-700' },
  single: { label: '单选题', className: 'bg-blue-100 text-blue-700' },
  multiple: { label: '多选题', className: 'bg-purple-100 text-purple-700' },
  judge: { label: '判断题', className: 'bg-green-100 text-green-700' },
  subjective: { label: '主观题', className: 'bg-orange-100 text-orange-700' },
  passed: { label: '通过', className: 'bg-green-100 text-green-700' },
  failed: { label: '未通过', className: 'bg-red-100 text-red-700' },
  makeup: { label: '补考', className: 'bg-orange-100 text-orange-700' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
  failed_record: { label: '未通过', className: 'bg-red-100 text-red-700' },
  pending_record: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
};

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
