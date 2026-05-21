import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardTab from './components/DashboardTab';
import CustomersTab from './components/CustomersTab';
import ReferralsTab from './components/ReferralsTab';
import RewardsTab from './components/RewardsTab';
import RankingTab from './components/RankingTab';
import SettingsTab from './components/SettingsTab';
import AuditTab from './components/AuditTab';
import Login from './components/Login';

// Modais
import NewCustomerModal from './components/NewCustomerModal';
import NewReferralModal from './components/NewReferralModal';
import CustomerDetailsModal from './components/CustomerDetailsModal';
import ConfirmDialog from './components/ConfirmDialog';

import { api } from './services/api';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('isp_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const isAuthenticated = !!currentUser;
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modais de Controle
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isNewReferralOpen, setIsNewReferralOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Toast System State
  const [toast, setToast] = useState(null);

  // Confirm Dialog State
  const [confirmConfig, setConfirmConfig] = useState(null);
  const showConfirm = (config) => setConfirmConfig(config);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('isp_dark_mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Atualizar cabeçalho / perfil da Sidebar com dados das configurações
  const syncAdminName = async () => {
    try {
      const settings = await api.getSettings();
      if (currentUser && currentUser.role === 'ADMIN' && currentUser.name !== settings.adminName) {
        const updated = { ...currentUser, name: settings.adminName };
        setCurrentUser(updated);
        localStorage.setItem('isp_auth_user', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncAdminName();
    }
  }, [isAuthenticated]);

  // Bloqueio de Segurança para Atendentes
  useEffect(() => {
    if (currentUser && currentUser.role === 'ATENDENTE' && (activeTab === 'settings' || activeTab === 'audit')) {
      setActiveTab('dashboard');
    }
  }, [activeTab, currentUser]);

  // Aplicar tema escuro no documento root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isp_dark_mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('isp_auth_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('isp_auth_user');
    showToast('Sessão encerrada.', 'info');
  };

  // Toast Trigger Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fechar toast automaticamente após 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Abre modal de detalhes de um cliente
  const openCustomerDetails = (id) => {
    setSelectedCustomerId(id);
    setIsDetailsOpen(true);
  };

  // Força atualização da aba ativa após interações nos modais
  const [reloadCounter, setReloadCounter] = useState(0);
  const triggerReload = () => {
    setReloadCounter(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} showToast={showToast} />;
  }

  return (
    <div className="flex bg-slate-50 dark:bg-[#030722] min-h-screen text-slate-700 dark:text-slate-200 transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            key={reloadCounter}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            openNewCustomerModal={() => setIsNewCustomerOpen(true)}
            openNewReferralModal={() => setIsNewReferralOpen(true)}
            openCustomerDetails={openCustomerDetails}
            showToast={showToast}
            showConfirm={showConfirm}
          />
        )}
        {activeTab === 'customers' && (
          <CustomersTab 
            key={reloadCounter}
            openNewCustomerModal={() => setIsNewCustomerOpen(true)}
            openCustomerDetails={openCustomerDetails}
            showToast={showToast}
            showConfirm={showConfirm}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'referrals' && (
          <ReferralsTab 
            key={reloadCounter}
            openNewReferralModal={() => setIsNewReferralOpen(true)}
            openCustomerDetails={openCustomerDetails}
            showToast={showToast}
            showConfirm={showConfirm}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'rewards' && (
          <RewardsTab 
            key={reloadCounter}
            openCustomerDetails={openCustomerDetails}
            showToast={showToast}
            showConfirm={showConfirm}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'ranking' && (
          <RankingTab 
            key={reloadCounter}
            openCustomerDetails={openCustomerDetails}
            showToast={showToast}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab 
            showToast={showToast}
            showConfirm={showConfirm}
            currentUser={currentUser}
            onSettingsUpdate={(sett) => {
              const updated = { ...currentUser, name: sett.adminName };
              setCurrentUser(updated);
              localStorage.setItem('isp_auth_user', JSON.stringify(updated));
            }}
          />
        )}
        {activeTab === 'audit' && (
          <AuditTab 
            key={reloadCounter}
            showToast={showToast}
            showConfirm={showConfirm}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* -------------------- MODALS -------------------- */}

      {/* New Customer Modal */}
      <NewCustomerModal 
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onSuccess={triggerReload}
        showToast={showToast}
        showConfirm={showConfirm}
      />

      {/* New Referral Modal */}
      <NewReferralModal 
        isOpen={isNewReferralOpen}
        onClose={() => setIsNewReferralOpen(false)}
        onSuccess={triggerReload}
        showToast={showToast}
      />

      {/* Customer Details Modal (Drawer) */}
      <CustomerDetailsModal 
        customerId={selectedCustomerId}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCustomerId(null);
        }}
        onUpdate={triggerReload}
        showToast={showToast}
        showConfirm={showConfirm}
        currentUser={currentUser}
      />

      {/* Global Confirm Dialog */}
      <ConfirmDialog config={confirmConfig} onClose={() => setConfirmConfig(null)} />

      {/* -------------------- DYNAMIC TOAST NOTIFICATION -------------------- */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white dark:bg-isp-navy shadow-2xl border-slate-200 dark:border-isp-border animate-slideUp text-xs font-semibold max-w-sm">
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-isp-cyan shrink-0" />}
          
          <span className="text-slate-800 dark:text-white flex-1">{toast.message}</span>
          
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
