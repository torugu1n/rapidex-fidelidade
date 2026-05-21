import React from 'react';
import {
  LayoutDashboard,
  Users,
  Share2,
  Gift,
  Trophy,
  Settings,
  LogOut,
  Sun,
  Moon,
  Wifi,
  History
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, darkMode, toggleDarkMode, onLogout, currentUser }) {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'referrals', label: 'Indicações', icon: Share2 },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'audit', label: 'Auditoria', icon: History },
  ];

  // Filtra as opções baseando-se no papel do usuário logado
  const menuItems = allMenuItems.filter(item => {
    if ((item.id === 'settings' || item.id === 'audit') && currentUser?.role === 'ATENDENTE') {
      return false;
    }
    return true;
  });

  const userName = currentUser?.name || 'Operador';

  return (
    <aside className="w-64 bg-isp-navy text-white flex flex-col justify-between border-r border-isp-border select-none h-screen sticky top-0">
      {/* Logo Area */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-isp-border/40">
          <div className="bg-gradient-accent p-2 rounded-lg text-white shadow-md shadow-isp-accent/25">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-white via-isp-cyan to-white bg-clip-text text-transparent">
              Rapidex Fidelidade
            </h1>
            <span className="text-xs text-isp-muted font-medium">Gerenciador de Indicações</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                  ? 'bg-isp-accent text-white shadow-md shadow-isp-accent/20'
                  : 'text-isp-muted hover:bg-isp-border/30 hover:text-white'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-isp-cyan rounded-r-md" />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User & Theme Toggle Area */}
      <div className="p-4 border-t border-isp-border/40 space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-isp-border/20 border border-isp-border/30 text-sm font-medium text-isp-muted hover:text-white transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-isp-cyan" />}
            <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </div>
          <span className="text-xs py-0.5 px-2 rounded-full bg-isp-border/50 text-white">
            {darkMode ? 'Escuro' : 'Claro'}
          </span>
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center justify-between bg-isp-border/10 p-3 rounded-xl border border-isp-border/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center border border-isp-border font-bold text-sm text-white shrink-0">
              {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-semibold truncate leading-tight text-white">{userName}</span>
              <span className={`text-[9px] font-bold mt-0.5 inline-block text-center rounded px-1.5 py-0.2 w-max ${currentUser?.role === 'ADMIN'
                ? 'bg-isp-accent/20 text-isp-cyan border border-isp-accent/30'
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                {currentUser?.role === 'ADMIN' ? 'Administrador' : 'Atendente'}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sair do Sistema"
            className="p-2 text-isp-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
