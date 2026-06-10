import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  RotateCcw,
  BarChart3,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: ReactNode;
}

const roleMenus: Record<string, MenuItem[]> = {
  admin: [
    { path: '/admin/dashboard', label: '数据总览', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/weak-points', label: '薄弱知识点', icon: <BarChart3 size={20} /> },
    { path: '/admin/training', label: '培训档案', icon: <ClipboardList size={20} /> },
  ],
  nursing: [
    { path: '/nursing/exams', label: '考试管理', icon: <FileText size={20} /> },
    { path: '/nursing/questions', label: '题库管理', icon: <BookOpen size={20} /> },
    { path: '/nursing/makeup', label: '补考管理', icon: <RotateCcw size={20} /> },
    { path: '/nursing/scores', label: '成绩管理', icon: <BarChart3 size={20} /> },
  ],
  teacher: [
    { path: '/teacher/review', label: '待批阅列表', icon: <ClipboardList size={20} /> },
    { path: '/teacher/scores', label: '成绩查看', icon: <BarChart3 size={20} /> },
  ],
  student: [
    { path: '/student/exams', label: '我的考试', icon: <FileText size={20} /> },
    { path: '/student/scores', label: '成绩查询', icon: <BarChart3 size={20} /> },
    { path: '/student/profile', label: '培训档案', icon: <ClipboardList size={20} /> },
  ],
};

const roleNames: Record<string, string> = {
  admin: '院级管理员',
  nursing: '护理部',
  teacher: '科室老师',
  student: '考生',
};

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menus = user ? roleMenus[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={cn(
          'bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-blue-500">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Building2 size={24} />
              <span className="font-bold text-lg">三基考试</span>
            </div>
          )}
          {!sidebarOpen && <Building2 size={24} className="mx-auto" />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-blue-500 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {menus.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 transition-all duration-200',
                  'hover:bg-blue-500/50',
                  isActive
                    ? 'bg-white/20 border-r-4 border-white font-medium'
                    : 'text-blue-100'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-blue-200 truncate">
                  {user?.department} · {roleNames[user?.role || '']}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-800">
            {menus.find((m) => m.path === location.pathname)?.label || '首页'}
          </h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
