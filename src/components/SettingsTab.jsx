import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit,
  FolderPlus, 
  User, 
  Shield, 
  Award, 
  X,
  PlusCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsTab({ showToast, showConfirm, onSettingsUpdate, currentUser }) {
  const [settings, setSettings] = useState(null);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (Rewards Settings)
  const [rewardType, setRewardType] = useState('');
  const [rewardValue, setRewardValue] = useState(50);
  const [referralsPerReward, setReferralsPerReward] = useState(3);

  // New Reward Type
  const [newRewardType, setNewRewardType] = useState('');

  // New Plan states
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');

  // New Operator states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('ATENDENTE');

  // Edit Operator states
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserRole, setEditUserRole] = useState('ATENDENTE');


  const loadAll = async () => {
    try {
      setLoading(true);
      const dataSettings = await api.getSettings();
      setSettings(dataSettings);
      
      setRewardType(dataSettings.defaultRewardType);
      setRewardValue(dataSettings.defaultRewardValue);
      setReferralsPerReward(dataSettings.referralsPerReward || 3);

      const dataPlans = await api.getPlans();
      setPlans(dataPlans);

      const dataUsers = await api.getUsers();
      setUsers(dataUsers);
    } catch (e) {
      showToast('Erro ao carregar configurações.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showConfirm({
      title: 'Salvar Configurações',
      description: 'Deseja salvar as alterações nas regras de operação padrão?',
      confirmLabel: 'Salvar',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          const updated = await api.updateSettings({
            defaultRewardType: rewardType,
            defaultRewardValue: parseFloat(rewardValue),
            referralsPerReward: parseInt(referralsPerReward),
            operatorName: currentUser?.name
          });
          setSettings(updated);
          showToast('Configurações salvas com sucesso!', 'success');
          if (onSettingsUpdate) {
            onSettingsUpdate(updated);
          }
        } catch (err) {
          showToast('Erro ao salvar configurações.', 'error');
        }
      }
    });
  };

  const handleAddRewardType = (e) => {
    e.preventDefault();
    const trimmed = newRewardType.trim();
    if (!trimmed) {
      showToast('Digite o nome do tipo de recompensa.', 'warning');
      return;
    }
    if (settings.rewardTypes.includes(trimmed)) {
      showToast('Este tipo de recompensa já está cadastrado.', 'warning');
      return;
    }

    showConfirm({
      title: 'Adicionar Tipo de Recompensa',
      description: `Tem certeza que deseja adicionar o tipo "${trimmed}"?`,
      confirmLabel: 'Adicionar',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          const updatedTypes = [...settings.rewardTypes, trimmed];
          const updated = await api.updateSettings({
            rewardTypes: updatedTypes,
            operatorName: currentUser?.name
          });
          setSettings(updated);
          showToast('Tipo de recompensa cadastrado com sucesso!', 'success');
          setNewRewardType('');
        } catch (err) {
          showToast('Erro ao cadastrar tipo de recompensa.', 'error');
        }
      }
    });
  };

  const handleDeleteRewardType = (typeToDelete) => {
    if (rewardType === typeToDelete) {
      showToast('Não é possível remover o tipo de recompensa que está atualmente definido como padrão.', 'error');
      return;
    }
    showConfirm({
      title: 'Excluir Tipo de Recompensa',
      description: `Tem certeza que deseja remover o tipo "${typeToDelete}"?`,
      confirmLabel: 'Remover',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          const updatedTypes = settings.rewardTypes.filter(t => t !== typeToDelete);
          const updated = await api.updateSettings({
            rewardTypes: updatedTypes,
            operatorName: currentUser?.name
          });
          setSettings(updated);
          showToast('Tipo de recompensa removido com sucesso!', 'success');
        } catch (err) {
          showToast('Erro ao remover tipo de recompensa.', 'error');
        }
      }
    });
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!newPlanName || !newPlanPrice) {
      showToast('Preencha os dados do plano.', 'warning');
      return;
    }
    showConfirm({
      title: 'Adicionar Plano de Internet',
      description: `Deseja adicionar o plano "${newPlanName}" por R$ ${parseFloat(newPlanPrice).toFixed(2)}/mês?`,
      confirmLabel: 'Adicionar',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          await api.addPlan({
            name: newPlanName,
            price: parseFloat(newPlanPrice)
          });
          showToast('Plano adicionado com sucesso!', 'success');
          setNewPlanName('');
          setNewPlanPrice('');
          const dataPlans = await api.getPlans();
          setPlans(dataPlans);
        } catch (err) {
          showToast('Erro ao adicionar plano.', 'error');
        }
      }
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      showToast('Preencha os dados do novo operador.', 'warning');
      return;
    }
    showConfirm({
      title: 'Cadastrar Operador',
      description: `Tem certeza que deseja cadastrar "${newUserName}" como operador com acesso ${newUserRole === 'ADMIN' ? 'Administrador' : 'Atendente'}?`,
      confirmLabel: 'Cadastrar',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: async () => {
        try {
          await api.addUser({
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            role: newUserRole
          });
          showToast('Operador cadastrado com sucesso!', 'success');
          setNewUserName('');
          setNewUserEmail('');
          setNewUserPassword('');
          setNewUserRole('ATENDENTE');
          const dataUsers = await api.getUsers();
          setUsers(dataUsers);
        } catch (err) {
          showToast(err.message || 'Erro ao cadastrar operador.', 'error');
        }
      }
    });
  };

  const handleDeleteUser = (id) => {
    if (currentUser && currentUser.id === id) {
      showToast('Você não pode excluir a sua própria conta ativa.', 'error');
      return;
    }
    const user = users.find(u => u.id === id);
    showConfirm({
      title: 'Remover Operador',
      description: `Tem certeza que deseja remover o operador "${user?.name}"? Ele perderá todo o acesso ao painel de fidelidade imediatamente.`,
      confirmLabel: 'Remover',
      cancelLabel: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteUser(id);
          showToast('Operador removido com sucesso!', 'success');
          const dataUsers = await api.getUsers();
          setUsers(dataUsers);
        } catch (err) {
          showToast('Erro ao remover operador.', 'error');
        }
      }
    });
  };

  const handleStartEditUser = (user) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPassword('');
    setEditUserRole(user.role);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editUserName || !editUserEmail) {
      showToast('Nome e login/e-mail são obrigatórios.', 'warning');
      return;
    }
    const doUpdate = async () => {
      try {
        const payload = {
          name: editUserName,
          email: editUserEmail,
          role: editUserRole
        };
        if (editUserPassword.trim() !== '') {
          payload.password = editUserPassword;
        }

        await api.updateUser(editingUser.id, payload);
        showToast('Operador atualizado com sucesso!', 'success');
        setEditingUser(null);

        const dataUsers = await api.getUsers();
        setUsers(dataUsers);

        if (currentUser && currentUser.id === editingUser.id) {
          const updatedUser = {
            ...currentUser,
            name: editUserName,
            email: editUserEmail,
            role: editUserRole
          };
          localStorage.setItem('isp_auth_user', JSON.stringify(updatedUser));
          showToast('Alterações salvas! Atualizando painel...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        showToast(err.message || 'Erro ao atualizar operador.', 'error');
      }
    };

    showConfirm({
      title: 'Atualizar Operador',
      description: `Deseja salvar as alterações para o operador "${editingUser.name}"?`,
      confirmLabel: 'Salvar',
      cancelLabel: 'Cancelar',
      type: 'success',
      onConfirm: doUpdate
    });
  };




  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-isp-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-isp-muted font-medium text-xs">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Painel Administrativo</h2>
        <p className="text-sm text-slate-500 dark:text-isp-muted">Gerencie as regras operacionais, tipos de recompensa, planos de internet e a equipe do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Rules & Reward Form */}
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-isp-border/30 pb-3">
              <Sliders className="w-5 h-5 text-isp-accent" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Regras Globais de Fidelidade</h3>
            </div>

            {/* Default Reward settings */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Recompensa e Regras
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-isp-muted">Tipo de Prêmio Padrão</label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent select-none"
                  >
                    {settings.rewardTypes?.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 dark:text-isp-muted">Valor da Recompensa (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rewardValue}
                    onChange={(e) => setRewardValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                  />
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <label className="text-xs text-slate-500 dark:text-isp-muted">Indicações necessárias para prêmio</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={referralsPerReward}
                  onChange={(e) => setReferralsPerReward(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
                <p className="text-[10px] text-slate-400 dark:text-isp-muted">Quantidade de indicações "Instaladas" que o cliente deve atingir por ciclo para receber a recompensa.</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-isp-accent/20"
            >
              Salvar Regras de Recompensa
            </button>
          </form>

          {/* Manage Reward Types */}
          <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-isp-border/30 pb-3">
              <Award className="w-5 h-5 text-isp-accent" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Tipos de Recompensa</h3>
            </div>

            {/* List of reward types */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {settings.rewardTypes?.map((type, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-isp-border/20 border border-slate-200/50 dark:border-isp-border/30 text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-medium">{type}</span>
                  <button
                    onClick={() => handleDeleteRewardType(type)}
                    className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 border border-transparent hover:border-rose-500/20 transition-all"
                    title="Remover tipo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new reward type form */}
            <form onSubmit={handleAddRewardType} className="space-y-3 pt-3 border-t border-slate-100 dark:border-isp-border/20">
              <label className="text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase block">
                Cadastrar Novo Tipo de Recompensa
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Mês Grátis de Internet"
                  value={newRewardType}
                  onChange={(e) => setNewRewardType(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-isp-border/30 hover:bg-slate-300 dark:hover:bg-isp-border/50 text-slate-800 dark:text-white text-xs font-bold transition-all border border-slate-300 dark:border-isp-border/40 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Plans Management */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-isp-border/30 pb-3">
              <FolderPlus className="w-5 h-5 text-isp-accent" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Planos de Internet</h3>
            </div>

            {/* Plans List */}
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {plans.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-isp-border/20 border border-slate-200/50 dark:border-isp-border/30 text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-medium">{p.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">R$ {p.price.toFixed(2)}/mês</span>
                </div>
              ))}
            </div>

            {/* Add Plan Form */}
            <form onSubmit={handleAddPlan} className="space-y-3 pt-3 border-t border-slate-100 dark:border-isp-border/20">
              <span className="text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase block">
                Cadastrar Novo Plano
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ex: Fibra 400 Mega"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço R$"
                  value={newPlanPrice}
                  onChange={(e) => setNewPlanPrice(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-isp-border/30 hover:bg-slate-300 dark:hover:bg-isp-border/50 text-slate-800 dark:text-white text-xs font-bold transition-all duration-200 border border-slate-300 dark:border-isp-border/40"
              >
                Adicionar Plano ao Sistema
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Gestão de Equipe Section (Somente para ADMIN) */}
      {currentUser?.role === 'ADMIN' && (
        <div className="bg-white dark:bg-isp-navy p-6 rounded-2xl border border-slate-200 dark:border-isp-border shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-isp-border/30 pb-3">
            <User className="w-5 h-5 text-isp-accent" />
            <h3 className="font-semibold text-slate-800 dark:text-white">Gestão da Equipe (Atendentes e Operadores)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form to add user */}
            <form onSubmit={handleAddUser} className="space-y-4 md:col-span-1 border-r border-slate-100 dark:border-isp-border/10 pr-0 md:pr-6">
              <span className="text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase block">
                Cadastrar Novo Operador
              </span>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 dark:text-isp-muted">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do Operador"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 dark:text-isp-muted">Login / E-mail</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: lucas.rapidex"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 dark:text-isp-muted">Senha Inicial</label>
                  <input
                    type="password"
                    required
                    placeholder="Defina a senha"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 dark:text-isp-muted">Nível de Acesso</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent select-none"
                  >
                    <option value="ATENDENTE">Atendente (Sem Configurações)</option>
                    <option value="ADMIN">Administrador (Acesso Total)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-isp-accent hover:bg-isp-brand text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Cadastrar Operador
              </button>
            </form>

            {/* List of users */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-semibold text-slate-400 dark:text-isp-muted uppercase block">
                Operadores Ativos
              </span>
              <div className="overflow-x-auto border border-slate-100 dark:border-isp-border/20 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-isp-border/10 text-slate-500 dark:text-isp-muted border-b border-slate-100 dark:border-isp-border/20">
                      <th className="py-2.5 px-3 font-semibold">Nome</th>
                      <th className="py-2.5 px-3 font-semibold">Login / E-mail</th>
                      <th className="py-2.5 px-3 font-semibold">Nível</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-isp-border/10 text-slate-700 dark:text-slate-200">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-isp-border/5">
                        <td className="py-2.5 px-3 font-medium">{u.name}</td>
                        <td className="py-2.5 px-3 font-mono">{u.email}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-isp-accent/20 text-isp-cyan border border-isp-accent/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {u.role === 'ADMIN' ? 'Administrador' : 'Atendente'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEditUser(u)}
                              className="p-1.5 rounded-lg border text-isp-cyan hover:text-white hover:bg-isp-accent hover:border-isp-accent border-slate-200 dark:border-isp-border/30 bg-white dark:bg-transparent transition-all"
                              title="Editar Operador"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={currentUser?.id === u.id}
                              className={`p-1.5 rounded-lg border transition-all ${
                                currentUser?.id === u.id
                                  ? 'text-slate-400 dark:text-slate-600 border-slate-200 dark:border-isp-border/20 cursor-not-allowed bg-slate-100 dark:bg-transparent'
                                  : 'text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 border-slate-200 dark:border-isp-border/30 bg-white dark:bg-transparent'
                              }`}
                              title={currentUser?.id === u.id ? "Sua conta atual logada" : "Remover Operador"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Operador */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" 
            onClick={() => setEditingUser(null)} 
          />

          <div className="bg-white dark:bg-isp-navy w-full max-w-md rounded-2xl border border-slate-200 dark:border-isp-border shadow-2xl z-10 overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-isp-border/30">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-isp-accent" />
                <span>Editar Operador</span>
              </h3>
              <button 
                onClick={() => setEditingUser(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-isp-border/30 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-isp-muted">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do Operador"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-isp-muted">Login / E-mail</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: lucas.rapidex"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-isp-muted flex justify-between">
                  <span>Nova Senha</span>
                  <span className="text-[10px] text-slate-400 dark:text-isp-muted font-normal">(Opcional)</span>
                </label>
                <input
                  type="password"
                  placeholder="Digite para alterar ou deixe em branco"
                  value={editUserPassword}
                  onChange={(e) => setEditUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent"
                />
                <p className="text-[10px] text-slate-400 dark:text-isp-muted">Deixe este campo vazio caso não queira alterar a senha atual deste operador.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-isp-muted">Nível de Acesso</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-isp-border/20 border border-slate-200 dark:border-isp-border/30 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-isp-accent select-none"
                >
                  <option value="ATENDENTE">Atendente (Sem Configurações)</option>
                  <option value="ADMIN">Administrador (Acesso Total)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-isp-border/20">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-isp-border/40 hover:bg-slate-50 dark:hover:bg-isp-border/20 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-isp-accent hover:bg-isp-accent/90 text-white text-xs font-semibold transition-all shadow-md shadow-isp-accent/15"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
