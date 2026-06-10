import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building2, Shield, Heart, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

const roleOptions: { value: UserRole; label: string; icon: typeof Shield; desc: string }[] = [
  { value: 'admin', label: '院级管理员', icon: Shield, desc: '查看全院数据汇总' },
  { value: 'nursing', label: '护理部', icon: Heart, desc: '考试发布与管理' },
  { value: 'teacher', label: '科室老师', icon: Stethoscope, desc: '主观题批阅' },
  { value: 'student', label: '考生', icon: User, desc: '参加考试与培训' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password, selectedRole);
      if (success) {
        const redirectMap: Record<UserRole, string> = {
          admin: '/admin/dashboard',
          nursing: '/nursing/exams',
          teacher: '/teacher/review',
          student: '/student/exams',
        };
        navigate(redirectMap[selectedRole]);
      } else {
        setError('账号或密码错误，请重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: UserRole) => {
    const accounts: Record<UserRole, { username: string; password: string }> = {
      admin: { username: 'admin', password: '123456' },
      nursing: { username: 'nursing', password: '123456' },
      teacher: { username: 'teacher', password: '123456' },
      student: { username: 'student', password: '123456' },
    };
    setSelectedRole(role);
    setUsername(accounts[role].username);
    setPassword(accounts[role].password);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">医院三基考试管理系统</h1>
              <p className="text-blue-200 mt-1">Hospital Three-Basics Examination System</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            在线考试<br />
            智能管理
          </h2>
          <p className="text-blue-200 text-lg mb-12 max-w-md">
            按岗位分层考试，成绩自动归档，薄弱知识点智能分析，助力医护人员专业能力提升
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-lg">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm text-blue-200 mt-1">用户角色</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm text-blue-200 mt-1">功能模块</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-blue-200 mt-1">岗位题库</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[480px] bg-white flex flex-col justify-center px-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎登录</h2>
          <p className="text-gray-500">请选择您的身份并输入账号密码</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => quickLogin(role.value)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center mb-2',
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                  )}
                >
                  <Icon size={20} />
                </div>
                <p className={cn('font-medium text-sm', isSelected ? 'text-blue-700' : 'text-gray-700')}>
                  {role.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">账号</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入账号"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-3 rounded-lg font-medium text-white transition-all duration-200',
              'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
              'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">演示账号（点击上方角色快速填充）</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>admin / 123456（院级管理员）</div>
            <div>nursing / 123456（护理部）</div>
            <div>teacher / 123456（科室老师）</div>
            <div>student / 123456（考生）</div>
          </div>
        </div>
      </div>
    </div>
  );
}
