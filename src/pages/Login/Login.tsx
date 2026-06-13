import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building2, Shield, Heart, Stethoscope, ChevronRight, Search, ChevronLeft, Check, UserCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole, User as UserType } from '../../types';
import { mockUsers } from '../../mock/data';
import { cn } from '../../lib/utils';

const roleOptions: { value: UserRole; label: string; icon: typeof Shield; desc: string }[] = [
  { value: 'admin', label: '院级管理员', icon: Shield, desc: '查看全院数据汇总' },
  { value: 'nursing', label: '护理部', icon: Heart, desc: '考试发布与管理' },
  { value: 'teacher', label: '科室老师', icon: Stethoscope, desc: '主观题批阅' },
  { value: 'student', label: '考生', icon: User, desc: '参加考试与培训' },
];

const positionLabels: Record<string, string> = {
  doctor: '医生',
  nurse: '护士',
  technician: '技师',
};

type Step = 'role' | 'department' | 'user' | 'password';

export default function Login() {
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [password, setPassword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginByUserId, getDepartmentsByRole, searchUsers } = useAuthStore();
  const navigate = useNavigate();

  const departments = useMemo(
    () => (selectedRole ? getDepartmentsByRole(selectedRole) : []),
    [selectedRole, getDepartmentsByRole]
  );

  const users = useMemo(
    () => (selectedRole && selectedDepartment ? searchUsers(selectedRole, selectedDepartment, searchKeyword) : []),
    [selectedRole, selectedDepartment, searchKeyword, searchUsers]
  );

  const goBack = () => {
    setError('');
    if (step === 'password') setStep('user');
    else if (step === 'user') setStep('department');
    else if (step === 'department') setStep('role');
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setStep('department');
    setError('');
  };

  const handleSelectDepartment = (dept: string) => {
    setSelectedDepartment(dept);
    setStep('user');
    setSearchKeyword('');
    setError('');
  };

  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);
    setPassword('');
    setStep('password');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError('');
    setLoading(true);

    try {
      const success = await loginByUserId(selectedUser.id, password);
      if (success && selectedRole) {
        const redirectMap: Record<UserRole, string> = {
          admin: '/admin/dashboard',
          nursing: '/nursing/exams',
          teacher: '/teacher/review',
          student: '/student/exams',
        };
        navigate(redirectMap[selectedRole]);
      } else {
        setError('密码错误，请重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleInfo = roleOptions.find((r) => r.value === selectedRole);

  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 text-sm mb-6">
      <button
        onClick={() => {
          setStep('role');
          setSelectedRole(null);
          setSelectedDepartment('');
          setSelectedUser(null);
          setError('');
        }}
        className={cn(
          'px-3 py-1.5 rounded-lg transition-colors',
          step === 'role' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'
        )}
      >
        选择身份
      </button>
      {selectedRole && (
        <>
          <ChevronRight size={14} className="text-gray-300" />
          <button
            onClick={() => selectedRole && (setStep('department'), setSelectedDepartment(''), setSelectedUser(null), setError(''))}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-colors',
              step === 'department' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'
            )}
            disabled={step === 'role'}
          >
            选择科室
          </button>
        </>
      )}
      {selectedDepartment && (
        <>
          <ChevronRight size={14} className="text-gray-300" />
          <button
            onClick={() => { setSelectedUser(null); setStep('user'); setError(''); }}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-colors',
              step === 'user' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            选择人员
          </button>
        </>
      )}
      {selectedUser && (
        <>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-medium">
            验证密码
          </span>
        </>
      )}
    </div>
  );

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

      <div className="w-[520px] bg-white flex flex-col justify-center px-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎登录</h2>
          <p className="text-gray-500">
            {step === 'role' && '请选择您的身份'}
            {step === 'department' && `请选择您所在的科室（${selectedRoleInfo?.label}）`}
            {step === 'user' && `请选择您的账号（${selectedDepartment}）`}
            {step === 'password' && `您好，${selectedUser?.name}，请输入密码`}
          </p>
        </div>

        {step !== 'role' && renderBreadcrumb()}

        {step === 'role' && (
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  onClick={() => handleSelectRole(role.value)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 bg-gray-100 text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <p className="font-medium text-sm text-gray-700 group-hover:text-blue-700">{role.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                </button>
              );
            })}

            <div className="col-span-2 mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">演示账号快捷登录（默认密码：123456）</p>
              <div className="grid grid-cols-2 gap-2">
                {mockUsers.slice(0, 4).map((u) => {
                  const roleInfo = roleOptions.find((r) => r.value === u.role);
                  const Icon = roleInfo?.icon || User;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedRole(u.role);
                        setSelectedDepartment(u.department);
                        setSelectedUser(u);
                        setPassword('');
                        setStep('password');
                        setError('');
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className="text-gray-400 group-hover:text-blue-600" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                          {roleInfo?.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">工号 {u.employeeId} · {u.department}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 'department' && (
          <div className="space-y-3">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleSelectDepartment(dept)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Building2 size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 group-hover:text-blue-700">{dept}</p>
                      <p className="text-xs text-gray-500">
                        {getDepartmentsByRole(selectedRole!).filter((d) => d === dept).length > 0 &&
                          `${searchUsers(selectedRole!, dept, '').length} 名人员`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
                <p>当前角色暂无科室数据</p>
              </div>
            )}
            <button
              onClick={goBack}
              className="mt-4 w-full py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1.5"
            >
              <ChevronLeft size={16} />
              返回上一步
            </button>
          </div>
        )}

        {step === 'user' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="输入姓名或工号搜索..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full p-3.5 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 group-hover:text-blue-700">{user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <span>工号 {user.employeeId}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{positionLabels[user.position] || user.position}</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <UserCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm">{searchKeyword ? '未找到匹配的人员' : '该科室暂无人员'}</p>
                </div>
              )}
            </div>

            <button
              onClick={goBack}
              className="w-full py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1.5"
            >
              <ChevronLeft size={16} />
              返回上一步
            </button>
          </div>
        )}

        {step === 'password' && selectedUser && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-medium">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                <p className="text-xs text-blue-600 flex items-center gap-2">
                  <span>{selectedUser.department}</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  <span>工号 {selectedUser.employeeId}</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  <span>{positionLabels[selectedUser.position]}</span>
                </p>
              </div>
              <Check size={20} className="ml-auto text-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">登录密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">演示账号默认密码：123456</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <ChevronLeft size={16} />
                返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex-[2] py-3 rounded-lg font-medium text-white transition-all duration-200',
                  'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {loading ? '登录中...' : '登 录'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
