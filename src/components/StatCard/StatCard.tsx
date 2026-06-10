import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
};

const iconBgStyles = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

export default function StatCard({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-5 transition-all duration-200 hover:shadow-md',
        colorStyles[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                'text-xs mt-2 font-medium',
                trendUp ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-white',
            iconBgStyles[color]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
