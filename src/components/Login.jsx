import React, { useState } from 'react';
import { Wifi, Lock, Mail, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLogin, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(email, password);
      setLoading(false);
      onLogin(user);
      showToast('Bem-vindo de volta!', 'success');
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Erro ao realizar login.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#030722] relative overflow-hidden select-none px-4">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-isp-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-isp-cyan/10 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="bg-white dark:bg-isp-navy/80 w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-isp-border/80 shadow-2xl glass-panel relative z-10 transition-all duration-300">
        
        {/* Brand/Logo */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="bg-gradient-brand p-3 rounded-2xl text-white shadow-xl shadow-isp-brand/20 border border-isp-border/50">
            <Wifi className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Rapidex Fidelidade
            </h2>
            <p className="text-xs text-slate-500 dark:text-isp-muted mt-1 font-medium">
              Controle de indicações e recompensas da rede
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Login / E-mail de Acesso
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu login ou e-mail"
                className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-[#030722]/50 border border-slate-200 dark:border-isp-border/50 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500 dark:text-isp-muted flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Senha
              </label>
              <span className="text-[10px] text-slate-400 dark:text-isp-muted hover:underline cursor-pointer font-medium">
                Esqueceu a senha?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-[#030722]/50 border border-slate-200 dark:border-isp-border/50 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-isp-accent focus:ring-1 focus:ring-isp-accent transition-all"
              />
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-isp-accent hover:bg-isp-brand text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-isp-accent/25 flex items-center justify-center gap-2 group border border-isp-accent"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-[10px] text-slate-400 dark:text-isp-muted font-medium">
          Acesso restrito para funcionários da equipe de suporte e vendas.
        </div>
      </div>
    </div>
  );
}
